/**
 * WebRTC Peer Manager for P2P connections
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 6.1, 7.1, 8.1, 10.2, 14.1
 */

import type { WebRTCMessage } from './types'
import { serializeMessage, deserializeMessage } from './messages'

// ICE servers for STUN (helps with NAT traversal)
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

interface PeerConnection {
  ghostName: string
  pc: RTCPeerConnection
  dataChannel: RTCDataChannel | null
  isConnected: boolean
}

export interface PeerManagerCallbacks {
  onPeerConnected?: (ghostName: string) => void
  onPeerDisconnected?: (ghostName: string) => void
  onMessage?: (from: string, message: WebRTCMessage) => void
  onIceCandidate?: (ghostName: string, candidate: RTCIceCandidateInit) => void
  onError?: (ghostName: string, error: string) => void
}

/**
 * Check if WebRTC is supported in the current browser
 */
export function isWebRTCSupported(): boolean {
  return !!(
    typeof RTCPeerConnection !== 'undefined' &&
    typeof RTCSessionDescription !== 'undefined' &&
    typeof RTCIceCandidate !== 'undefined'
  )
}

/**
 * PeerManager handles WebRTC peer connections and data channels
 * for direct P2P messaging between ghosts.
 */
export class PeerManager {
  private peers: Map<string, PeerConnection> = new Map()
  private callbacks: PeerManagerCallbacks = {}
  private _localGhostName: string | null = null

  /**
   * Set the local ghost name (used as sender in messages)
   */
  setLocalGhostName(name: string): void {
    this._localGhostName = name
  }

  /**
   * Get the local ghost name
   */
  getLocalGhostName(): string | null {
    return this._localGhostName
  }

  /**
   * Set callbacks for peer events
   */
  setCallbacks(callbacks: PeerManagerCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  /**
   * Get list of connected peer names
   */
  getConnectedPeers(): string[] {
    return Array.from(this.peers.entries())
      .filter(([, peer]) => peer.isConnected)
      .map(([name]) => name)
  }

  /**
   * Check if a peer is connected
   */
  isPeerConnected(ghostName: string): boolean {
    return this.peers.get(ghostName)?.isConnected ?? false
  }

  /**
   * Create a new peer connection (as the initiator/offerer)
   */
  createPeerConnection(ghostName: string): RTCPeerConnection {
    // Close existing connection if any
    this.closePeer(ghostName)

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    
    // Create data channel (initiator creates the channel)
    const dataChannel = pc.createDataChannel('ghostnet', {
      ordered: true,
    })

    const peerConn: PeerConnection = {
      ghostName,
      pc,
      dataChannel,
      isConnected: false,
    }

    this.setupDataChannel(dataChannel, ghostName)
    this.setupPeerConnectionEvents(pc, ghostName)
    this.peers.set(ghostName, peerConn)

    return pc
  }

  /**
   * Create an offer for a peer connection
   */
  async createOffer(ghostName: string): Promise<RTCSessionDescriptionInit> {
    const peer = this.peers.get(ghostName)
    if (!peer) {
      throw new Error(`No peer connection for ${ghostName}`)
    }

    const offer = await peer.pc.createOffer()
    await peer.pc.setLocalDescription(offer)
    return offer
  }

  /**
   * Handle an incoming offer (as the answerer)
   */
  async handleOffer(ghostName: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    // Close existing connection if any
    this.closePeer(ghostName)

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    const peerConn: PeerConnection = {
      ghostName,
      pc,
      dataChannel: null,
      isConnected: false,
    }

    // Set up to receive data channel from initiator
    pc.ondatachannel = (event) => {
      peerConn.dataChannel = event.channel
      this.setupDataChannel(event.channel, ghostName)
    }

    this.setupPeerConnectionEvents(pc, ghostName)
    this.peers.set(ghostName, peerConn)

    await pc.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return answer
  }

  /**
   * Handle an incoming answer
   */
  async handleAnswer(ghostName: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peer = this.peers.get(ghostName)
    if (!peer) {
      console.warn(`No peer connection for ${ghostName}`)
      return
    }

    await peer.pc.setRemoteDescription(new RTCSessionDescription(answer))
  }

  /**
   * Add an ICE candidate from a peer
   */
  async addIceCandidate(ghostName: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peer = this.peers.get(ghostName)
    if (!peer) {
      console.warn(`No peer connection for ${ghostName}`)
      return
    }

    try {
      await peer.pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error(`Failed to add ICE candidate for ${ghostName}:`, error)
    }
  }

  /**
   * Send a message to a specific peer
   */
  sendMessage(ghostName: string, message: WebRTCMessage): boolean {
    const peer = this.peers.get(ghostName)
    if (!peer?.dataChannel || peer.dataChannel.readyState !== 'open') {
      return false
    }

    try {
      peer.dataChannel.send(serializeMessage(message))
      return true
    } catch (error) {
      console.error(`Failed to send message to ${ghostName}:`, error)
      return false
    }
  }

  /**
   * Broadcast a message to all connected peers
   */
  broadcast(message: WebRTCMessage): void {
    const data = serializeMessage(message)
    
    for (const [ghostName, peer] of this.peers.entries()) {
      if (peer.dataChannel?.readyState === 'open') {
        try {
          peer.dataChannel.send(data)
        } catch (error) {
          console.error(`Failed to broadcast to ${ghostName}:`, error)
        }
      }
    }
  }

  /**
   * Close a specific peer connection
   */
  closePeer(ghostName: string): void {
    const peer = this.peers.get(ghostName)
    if (peer) {
      peer.dataChannel?.close()
      peer.pc.close()
      this.peers.delete(ghostName)
    }
  }

  /**
   * Close all peer connections
   */
  closeAll(): void {
    for (const [ghostName] of this.peers) {
      this.closePeer(ghostName)
    }
  }

  /**
   * Set up event handlers for a data channel
   */
  private setupDataChannel(channel: RTCDataChannel, ghostName: string): void {
    channel.onopen = () => {
      console.log(`📡 Data channel open with ${ghostName}`)
      const peer = this.peers.get(ghostName)
      if (peer) {
        peer.isConnected = true
        this.callbacks.onPeerConnected?.(ghostName)
      }
    }

    channel.onclose = () => {
      console.log(`📡 Data channel closed with ${ghostName}`)
      const peer = this.peers.get(ghostName)
      if (peer) {
        peer.isConnected = false
        this.callbacks.onPeerDisconnected?.(ghostName)
      }
    }

    channel.onerror = (error) => {
      console.error(`Data channel error with ${ghostName}:`, error)
      this.callbacks.onError?.(ghostName, 'Data channel error')
    }

    channel.onmessage = (event) => {
      const message = deserializeMessage(event.data)
      if (message) {
        this.callbacks.onMessage?.(ghostName, message)
      } else {
        console.warn(`Invalid message from ${ghostName}:`, event.data)
      }
    }
  }

  /**
   * Set up event handlers for a peer connection
   */
  private setupPeerConnectionEvents(pc: RTCPeerConnection, ghostName: string): void {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.callbacks.onIceCandidate?.(ghostName, event.candidate.toJSON())
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${ghostName}: ${pc.iceConnectionState}`)
      
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        const peer = this.peers.get(ghostName)
        if (peer && peer.isConnected) {
          peer.isConnected = false
          this.callbacks.onPeerDisconnected?.(ghostName)
        }
      }
    }

    pc.onconnectionstatechange = () => {
      console.log(`Connection state for ${ghostName}: ${pc.connectionState}`)
      
      if (pc.connectionState === 'failed') {
        this.callbacks.onError?.(ghostName, 'Peer connection failed')
        this.closePeer(ghostName)
      }
    }
  }
}

/**
 * Create a new PeerManager instance
 */
export function createPeerManager(): PeerManager {
  return new PeerManager()
}

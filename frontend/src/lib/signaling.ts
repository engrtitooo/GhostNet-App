/**
 * Signaling Client for WebRTC connection establishment
 * Requirements: 2.1, 2.2, 2.5, 3.2, 3.3, 3.4, 14.3
 */

import type {
  SignalingMessage,
  JoinMessage,
  OfferMessage,
  AnswerMessage,
  IceCandidateMessage,
  GhostListMessage,
  GhostJoinedMessage,
  GhostLeftMessage,
  ErrorMessage,
} from './types'

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface SignalingClientCallbacks {
  onGhostList?: (ghosts: string[]) => void
  onGhostJoined?: (ghostName: string) => void
  onGhostLeft?: (ghostName: string) => void
  onOffer?: (from: string, offer: RTCSessionDescriptionInit) => void
  onAnswer?: (from: string, answer: RTCSessionDescriptionInit) => void
  onIceCandidate?: (from: string, candidate: RTCIceCandidateInit) => void
  onError?: (message: string, code?: string) => void
  onConnectionStateChange?: (state: ConnectionState) => void
}

/**
 * SignalingClient manages WebSocket connection to the signaling server
 * for WebRTC peer connection establishment.
 */
export class SignalingClient {
  private ws: WebSocket | null = null
  private serverUrl: string
  private ghostName: string | null = null
  private callbacks: SignalingClientCallbacks = {}
  private _connectionState: ConnectionState = 'disconnected'
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectDelay = 1000
  private intentionalDisconnect = false

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl
  }

  /**
   * Get current connection state
   */
  get connectionState(): ConnectionState {
    return this._connectionState
  }

  /**
   * Set callbacks for signaling events
   */
  setCallbacks(callbacks: SignalingClientCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  /**
   * Connect to the signaling server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      this.setConnectionState('connecting')

      try {
        this.ws = new WebSocket(this.serverUrl)

        this.ws.onopen = () => {
          console.log('🔌 Connected to signaling server')
          this.setConnectionState('connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.ws.onclose = () => {
          console.log('🔌 Disconnected from signaling server')
          this.setConnectionState('disconnected')
          this.attemptReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.setConnectionState('error')
          this.callbacks.onError?.('Failed to connect to signaling server')
          reject(new Error('WebSocket connection failed'))
        }
      } catch (error) {
        this.setConnectionState('error')
        reject(error)
      }
    })
  }

  /**
   * Disconnect from the signaling server
   */
  disconnect(): void {
    this.intentionalDisconnect = true
    // Clear callbacks to prevent any error notifications after intentional disconnect
    this.callbacks = {}
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this._connectionState = 'disconnected'
  }

  /**
   * Send join message to enter the lobby
   */
  sendJoin(ghostName: string): void {
    this.ghostName = ghostName
    const message: JoinMessage = {
      type: 'join',
      payload: { ghostName }
    }
    this.send(message)
  }

  /**
   * Send WebRTC offer to a specific ghost
   */
  sendOffer(to: string, offer: RTCSessionDescriptionInit): void {
    if (!this.ghostName) return
    const message: OfferMessage = {
      type: 'offer',
      from: this.ghostName,
      to,
      payload: offer
    }
    this.send(message)
  }

  /**
   * Send WebRTC answer to a specific ghost
   */
  sendAnswer(to: string, answer: RTCSessionDescriptionInit): void {
    if (!this.ghostName) return
    const message: AnswerMessage = {
      type: 'answer',
      from: this.ghostName,
      to,
      payload: answer
    }
    this.send(message)
  }

  /**
   * Send ICE candidate to a specific ghost
   */
  sendIceCandidate(to: string, candidate: RTCIceCandidateInit): void {
    if (!this.ghostName) return
    const message: IceCandidateMessage = {
      type: 'ice_candidate',
      from: this.ghostName,
      to,
      payload: candidate
    }
    this.send(message)
  }

  /**
   * Send a message to the signaling server
   */
  private send(message: SignalingMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('Cannot send message: WebSocket not connected')
    }
  }

  /**
   * Handle incoming message from signaling server
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data) as SignalingMessage

      switch (message.type) {
        case 'ghost_list':
          this.callbacks.onGhostList?.((message as GhostListMessage).payload.ghosts)
          break

        case 'ghost_joined':
          this.callbacks.onGhostJoined?.((message as GhostJoinedMessage).payload.ghostName)
          break

        case 'ghost_left':
          this.callbacks.onGhostLeft?.((message as GhostLeftMessage).payload.ghostName)
          break

        case 'offer': {
          const offerMsg = message as OfferMessage
          this.callbacks.onOffer?.(offerMsg.from, offerMsg.payload)
          break
        }

        case 'answer': {
          const answerMsg = message as AnswerMessage
          this.callbacks.onAnswer?.(answerMsg.from, answerMsg.payload)
          break
        }

        case 'ice_candidate': {
          const iceMsg = message as IceCandidateMessage
          this.callbacks.onIceCandidate?.(iceMsg.from, iceMsg.payload)
          break
        }

        case 'error': {
          const errorMsg = message as ErrorMessage
          this.callbacks.onError?.(errorMsg.payload.message, errorMsg.payload.code)
          break
        }

        default:
          console.log('Unknown signaling message type:', message.type)
      }
    } catch (error) {
      console.error('Failed to parse signaling message:', error)
    }
  }

  /**
   * Update connection state and notify callbacks
   */
  private setConnectionState(state: ConnectionState): void {
    this._connectionState = state
    this.callbacks.onConnectionStateChange?.(state)
  }

  /**
   * Attempt to reconnect to the signaling server
   */
  private attemptReconnect(): void {
    // Don't reconnect if user intentionally disconnected
    if (this.intentionalDisconnect) {
      return
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached')
      this.setConnectionState('error')
      this.callbacks.onError?.('Lost connection to signaling server')
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

    setTimeout(() => {
      this.connect().then(() => {
        // Re-join if we had a ghost name
        if (this.ghostName) {
          this.sendJoin(this.ghostName)
        }
      }).catch(() => {
        // Will trigger another reconnect attempt via onclose
      })
    }, this.reconnectDelay * this.reconnectAttempts)
  }
}

/**
 * Get the signaling server URL based on environment
 */
function getSignalingUrl(): string {
  // 1. Check for explicit environment variable (REQUIRED for production)
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL
  }
  
  // 2. Check if we're in production (not localhost)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // PRODUCTION ERROR: VITE_WS_URL must be set in Netlify environment variables
    console.error('❌ VITE_WS_URL not set! WebSocket connection will fail.')
    console.error('   Set VITE_WS_URL=wss://YOUR-RENDER-BACKEND.onrender.com/ws in Netlify')
    // Return a placeholder that will fail clearly
    return 'wss://MISSING-VITE-WS-URL.invalid/ws'
  }
  
  // 3. Local development - use localhost
  return 'ws://localhost:3001/ws'
}

/**
 * Create a signaling client with the default server URL
 */
export function createSignalingClient(serverUrl?: string): SignalingClient {
  const url = serverUrl || getSignalingUrl()
  console.log(`🔌 Signaling URL: ${url}`)
  return new SignalingClient(url)
}

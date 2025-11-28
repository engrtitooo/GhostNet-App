/**
 * useGhostNet - Main hook for GhostNet functionality
 * Requirements: 1.4, 2.1, 2.2, 3.1, 4.1, 5.1, 5.4, 6.1, 6.3, 7.1, 7.2, 8.1, 8.2, 10.1, 10.2, 13.1, 13.2, 13.3
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { SignalingClient, createSignalingClient, ConnectionState } from '../lib/signaling'
import { PeerManager, createPeerManager, isWebRTCSupported } from '../lib/webrtc'
import { validateGhostName } from '../lib/validation'
import {
  createGhostMessage,
  createPersistentMessage,
  createShakeMessage,
  createWhisperMessage,
  generateMessageId,
} from '../lib/messages'
import { playWhisperSound } from '../lib/audio'
import type { Message, WebRTCMessage } from '../lib/types'

// Ghost message auto-removal timeout (5 seconds)
const GHOST_MESSAGE_TIMEOUT = 5000

export interface UseGhostNetReturn {
  // State
  ghostName: string | null
  connectedGhosts: string[]
  messages: Message[]
  connectionState: ConnectionState
  error: string | null
  webrtcSupported: boolean

  // Settings
  soundEnabled: boolean
  shakeEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  setShakeEnabled: (enabled: boolean) => void

  // Actions
  joinLobby: (name: string) => Promise<boolean>
  leaveLobby: () => void
  sendGhostMessage: (text: string) => void
  sendPersistentMessage: (text: string) => void
  triggerShake: () => void
  triggerWhisper: () => void

  // Effects
  isShaking: boolean
}

export function useGhostNet(): UseGhostNetReturn {
  // Core state
  const [ghostName, setGhostName] = useState<string | null>(null)
  const [connectedGhosts, setConnectedGhosts] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [error, setError] = useState<string | null>(null)

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [shakeEnabled, setShakeEnabled] = useState(true)

  // Effect state
  const [isShaking, setIsShaking] = useState(false)

  // WebRTC support check
  const [webrtcSupported] = useState(() => isWebRTCSupported())

  // Refs for signaling and peer manager (persist across renders)
  const signalingRef = useRef<SignalingClient | null>(null)
  const peerManagerRef = useRef<PeerManager | null>(null)

  /**
   * Add a message to the list
   */
  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg])

    // Auto-remove ghost messages after timeout
    if (msg.type === 'ghost') {
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== msg.id))
      }, GHOST_MESSAGE_TIMEOUT)
    }
  }, [])

  /**
   * Handle incoming WebRTC message
   */
  const handleIncomingMessage = useCallback((_from: string, message: WebRTCMessage) => {
    switch (message.type) {
      case 'ghost_message':
        addMessage({
          id: generateMessageId(),
          type: 'ghost',
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
          isOwn: false,
        })
        break

      case 'persistent_message':
        addMessage({
          id: generateMessageId(),
          type: 'persistent',
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
          isOwn: false,
        })
        break

      case 'shake':
        if (shakeEnabled) {
          setIsShaking(true)
          setTimeout(() => setIsShaking(false), 500)
        }
        break

      case 'whisper':
        if (soundEnabled) {
          playWhisperSound()
        }
        break
    }
  }, [addMessage, shakeEnabled, soundEnabled])

  /**
   * Set up peer connection with a ghost
   */
  const setupPeerConnection = useCallback(async (targetGhost: string, isInitiator: boolean) => {
    const peerManager = peerManagerRef.current
    const signaling = signalingRef.current
    if (!peerManager || !signaling) return

    try {
      if (isInitiator) {
        // We initiate the connection
        peerManager.createPeerConnection(targetGhost)
        const offer = await peerManager.createOffer(targetGhost)
        signaling.sendOffer(targetGhost, offer)
      }
    } catch (err) {
      console.error(`Failed to set up peer connection with ${targetGhost}:`, err)
      setError(`Failed to connect to ${targetGhost}`)
    }
  }, [])

  /**
   * Join the lobby with a ghost name
   */
  const joinLobby = useCallback(async (name: string): Promise<boolean> => {
    // Validate name
    const validation = validateGhostName(name)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid ghost name')
      return false
    }

    // Check WebRTC support
    if (!webrtcSupported) {
      setError('Your browser does not support WebRTC')
      return false
    }

    setError(null)
    const trimmedName = name.trim()

    // Create signaling client and peer manager
    const signaling = createSignalingClient()
    const peerManager = createPeerManager()

    signalingRef.current = signaling
    peerManagerRef.current = peerManager
    peerManager.setLocalGhostName(trimmedName)

    // Set up signaling callbacks
    signaling.setCallbacks({
      onConnectionStateChange: setConnectionState,

      onGhostList: (ghosts) => {
        setConnectedGhosts(ghosts)
        // Initiate connections with all existing ghosts
        ghosts.forEach(ghost => setupPeerConnection(ghost, true))
      },

      onGhostJoined: (newGhost) => {
        setConnectedGhosts(prev => [...prev, newGhost])
        // New ghost will initiate connection with us
      },

      onGhostLeft: (leftGhost) => {
        setConnectedGhosts(prev => prev.filter(g => g !== leftGhost))
        peerManager.closePeer(leftGhost)
      },

      onOffer: async (from, offer) => {
        try {
          const answer = await peerManager.handleOffer(from, offer)
          signaling.sendAnswer(from, answer)
        } catch (err) {
          console.error(`Failed to handle offer from ${from}:`, err)
        }
      },

      onAnswer: async (from, answer) => {
        try {
          await peerManager.handleAnswer(from, answer)
        } catch (err) {
          console.error(`Failed to handle answer from ${from}:`, err)
        }
      },

      onIceCandidate: async (from, candidate) => {
        try {
          await peerManager.addIceCandidate(from, candidate)
        } catch (err) {
          console.error(`Failed to add ICE candidate from ${from}:`, err)
        }
      },

      onError: (message, code) => {
        setError(message)
        if (code === 'NAME_TAKEN') {
          setConnectionState('error')
        }
      },
    })

    // Set up peer manager callbacks
    peerManager.setCallbacks({
      onPeerConnected: (ghost) => {
        console.log(`✅ Connected to ${ghost}`)
      },

      onPeerDisconnected: (ghost) => {
        console.log(`❌ Disconnected from ${ghost}`)
      },

      onMessage: handleIncomingMessage,

      onIceCandidate: (ghost, candidate) => {
        signaling.sendIceCandidate(ghost, candidate)
      },

      onError: (ghost, errorMsg) => {
        console.error(`Peer error with ${ghost}: ${errorMsg}`)
      },
    })

    // Connect to signaling server
    try {
      await signaling.connect()
      signaling.sendJoin(trimmedName)
      setGhostName(trimmedName)
      return true
    } catch (err) {
      setError('Failed to connect to server')
      setConnectionState('error')
      return false
    }
  }, [webrtcSupported, setupPeerConnection, handleIncomingMessage])

  /**
   * Leave the lobby
   */
  const leaveLobby = useCallback(() => {
    signalingRef.current?.disconnect()
    peerManagerRef.current?.closeAll()
    signalingRef.current = null
    peerManagerRef.current = null

    setGhostName(null)
    setConnectedGhosts([])
    setMessages([])
    setConnectionState('disconnected')
    setError(null)
  }, [])

  /**
   * Send a ghost message (disappears after 5 seconds)
   */
  const sendGhostMessage = useCallback((text: string) => {
    if (!ghostName || !text.trim()) return

    const message = createGhostMessage(ghostName, text.trim())
    peerManagerRef.current?.broadcast(message)

    // Add to local messages
    addMessage({
      id: generateMessageId(),
      type: 'ghost',
      sender: ghostName,
      content: text.trim(),
      timestamp: message.timestamp,
      isOwn: true,
    })
  }, [ghostName, addMessage])

  /**
   * Send a persistent message (stays in history)
   */
  const sendPersistentMessage = useCallback((text: string) => {
    if (!ghostName || !text.trim()) return

    const message = createPersistentMessage(ghostName, text.trim())
    peerManagerRef.current?.broadcast(message)

    // Add to local messages
    addMessage({
      id: generateMessageId(),
      type: 'persistent',
      sender: ghostName,
      content: text.trim(),
      timestamp: message.timestamp,
      isOwn: true,
    })
  }, [ghostName, addMessage])

  /**
   * Trigger screen shake on all peers and locally
   */
  const triggerShake = useCallback(() => {
    if (!ghostName) return

    const message = createShakeMessage(ghostName)
    peerManagerRef.current?.broadcast(message)

    // Also trigger locally
    if (shakeEnabled) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }, [ghostName, shakeEnabled])

  /**
   * Trigger whisper sound on all peers and locally
   */
  const triggerWhisper = useCallback(() => {
    if (!ghostName) return

    const message = createWhisperMessage(ghostName)
    peerManagerRef.current?.broadcast(message)

    // Also trigger locally
    if (soundEnabled) {
      playWhisperSound()
    }
  }, [ghostName, soundEnabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      signalingRef.current?.disconnect()
      peerManagerRef.current?.closeAll()
    }
  }, [])

  return {
    // State
    ghostName,
    connectedGhosts,
    messages,
    connectionState,
    error,
    webrtcSupported,

    // Settings
    soundEnabled,
    shakeEnabled,
    setSoundEnabled,
    setShakeEnabled,

    // Actions
    joinLobby,
    leaveLobby,
    sendGhostMessage,
    sendPersistentMessage,
    triggerShake,
    triggerWhisper,

    // Effects
    isShaking,
  }
}

import { WebSocket } from 'ws'
import { LobbyManager } from './lobby.js'
import type {
  SignalingMessage,
  JoinMessage,
  OfferMessage,
  AnswerMessage,
  IceCandidateMessage,
  ErrorMessage,
  SignalingMessageType,
} from './types.js'

// Valid signaling message types that the server will process
const VALID_SIGNALING_TYPES: SignalingMessageType[] = [
  'join',
  'leave',
  'offer',
  'answer',
  'ice_candidate',
]

/**
 * Check if a message type is a valid signaling type that the server should process.
 * The server only handles connection-related messages, not chat messages.
 */
export function isValidServerMessageType(type: string): boolean {
  return VALID_SIGNALING_TYPES.includes(type as SignalingMessageType)
}

/**
 * SignalingHandler manages WebSocket message handling for WebRTC signaling.
 */
export class SignalingHandler {
  private lobby: LobbyManager
  private wsToGhost: Map<WebSocket, string> = new Map()

  constructor(lobby: LobbyManager) {
    this.lobby = lobby
  }

  /**
   * Handle a new WebSocket connection
   */
  handleConnection(ws: WebSocket): void {
    console.log('🔌 New WebSocket connection')

    ws.on('message', (data) => {
      this.handleMessage(ws, data.toString())
    })

    ws.on('close', () => {
      this.handleDisconnect(ws)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      this.handleDisconnect(ws)
    })
  }

  /**
   * Handle incoming WebSocket message
   */
  handleMessage(ws: WebSocket, rawData: string): void {
    let message: SignalingMessage

    try {
      message = JSON.parse(rawData) as SignalingMessage
    } catch {
      console.error('Invalid JSON received:', rawData)
      this.sendError(ws, 'Invalid JSON format')
      return
    }

    // Only process valid signaling message types
    if (!message.type || !isValidServerMessageType(message.type)) {
      console.log(`Ignoring non-signaling message type: ${message.type}`)
      return
    }

    switch (message.type) {
      case 'join':
        this.handleJoin(ws, message as JoinMessage)
        break
      case 'leave':
        this.handleLeave(ws)
        break
      case 'offer':
        this.handleOffer(message as OfferMessage)
        break
      case 'answer':
        this.handleAnswer(message as AnswerMessage)
        break
      case 'ice_candidate':
        this.handleIceCandidate(message as IceCandidateMessage)
        break
    }
  }

  /**
   * Handle ghost joining the lobby
   */
  private handleJoin(ws: WebSocket, message: JoinMessage): void {
    const { ghostName } = message.payload

    if (!ghostName || typeof ghostName !== 'string') {
      this.sendError(ws, 'Invalid ghost name')
      return
    }

    // Check if name is already taken
    if (this.lobby.hasGhost(ghostName)) {
      this.sendError(ws, 'Ghost name already taken', 'NAME_TAKEN')
      return
    }

    // Add ghost to lobby
    if (this.lobby.addGhost(ghostName, ws)) {
      this.wsToGhost.set(ws, ghostName)

      // Send current ghost list to the new ghost
      this.lobby.sendGhostList(ghostName)

      // Broadcast to others that a new ghost joined
      this.lobby.broadcastGhostJoined(ghostName)
    }
  }

  /**
   * Handle ghost leaving the lobby
   */
  private handleLeave(ws: WebSocket): void {
    const ghostName = this.wsToGhost.get(ws)
    if (ghostName) {
      this.lobby.removeGhost(ghostName)
      this.wsToGhost.delete(ws)
      this.lobby.broadcastGhostLeft(ghostName)
    }
  }

  /**
   * Handle WebRTC offer relay
   */
  private handleOffer(message: OfferMessage): void {
    const { from, to, payload } = message
    if (!from || !to || !payload) {
      console.error('Invalid offer message')
      return
    }

    console.log(`📤 Relaying offer from ${from} to ${to}`)
    this.lobby.sendTo(to, message)
  }

  /**
   * Handle WebRTC answer relay
   */
  private handleAnswer(message: AnswerMessage): void {
    const { from, to, payload } = message
    if (!from || !to || !payload) {
      console.error('Invalid answer message')
      return
    }

    console.log(`📤 Relaying answer from ${from} to ${to}`)
    this.lobby.sendTo(to, message)
  }

  /**
   * Handle ICE candidate relay
   */
  private handleIceCandidate(message: IceCandidateMessage): void {
    const { from, to, payload } = message
    if (!from || !to || !payload) {
      console.error('Invalid ICE candidate message')
      return
    }

    this.lobby.sendTo(to, message)
  }

  /**
   * Handle WebSocket disconnection
   */
  handleDisconnect(ws: WebSocket): void {
    const ghostName = this.wsToGhost.get(ws)
    if (ghostName) {
      this.lobby.removeGhost(ghostName)
      this.wsToGhost.delete(ws)
      this.lobby.broadcastGhostLeft(ghostName)
      console.log(`🔌 Ghost disconnected: ${ghostName}`)
    }
  }

  /**
   * Send an error message to a WebSocket
   */
  private sendError(ws: WebSocket, message: string, code?: string): void {
    const errorMsg: ErrorMessage = {
      type: 'error',
      payload: { message, code }
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(errorMsg))
    }
  }
}

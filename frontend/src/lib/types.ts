// ============================================
// Signaling Messages (Backend ↔ Frontend)
// ============================================

export type SignalingMessageType =
  | 'join'
  | 'leave'
  | 'ghost_list'
  | 'ghost_joined'
  | 'ghost_left'
  | 'offer'
  | 'answer'
  | 'ice_candidate'
  | 'error'

export interface BaseSignalingMessage {
  type: SignalingMessageType
  from?: string
  to?: string
}

export interface JoinMessage extends BaseSignalingMessage {
  type: 'join'
  payload: { ghostName: string }
}

export interface LeaveMessage extends BaseSignalingMessage {
  type: 'leave'
  payload: { ghostName: string }
}

export interface GhostListMessage extends BaseSignalingMessage {
  type: 'ghost_list'
  payload: { ghosts: string[] }
}

export interface GhostJoinedMessage extends BaseSignalingMessage {
  type: 'ghost_joined'
  payload: { ghostName: string }
}

export interface GhostLeftMessage extends BaseSignalingMessage {
  type: 'ghost_left'
  payload: { ghostName: string }
}

export interface OfferMessage extends BaseSignalingMessage {
  type: 'offer'
  from: string
  to: string
  payload: RTCSessionDescriptionInit
}

export interface AnswerMessage extends BaseSignalingMessage {
  type: 'answer'
  from: string
  to: string
  payload: RTCSessionDescriptionInit
}

export interface IceCandidateMessage extends BaseSignalingMessage {
  type: 'ice_candidate'
  from: string
  to: string
  payload: RTCIceCandidateInit
}

export interface ErrorMessage extends BaseSignalingMessage {
  type: 'error'
  payload: { message: string; code?: string }
}

export type SignalingMessage =
  | JoinMessage
  | LeaveMessage
  | GhostListMessage
  | GhostJoinedMessage
  | GhostLeftMessage
  | OfferMessage
  | AnswerMessage
  | IceCandidateMessage
  | ErrorMessage

// ============================================
// WebRTC Messages (Peer ↔ Peer)
// ============================================

export type WebRTCMessageType =
  | 'ghost_message'
  | 'persistent_message'
  | 'shake'
  | 'whisper'

export interface BaseWebRTCMessage {
  type: WebRTCMessageType
  sender: string
  timestamp: number
}

export interface GhostChatMessage extends BaseWebRTCMessage {
  type: 'ghost_message'
  content: string
}

export interface PersistentChatMessage extends BaseWebRTCMessage {
  type: 'persistent_message'
  content: string
}

export interface ShakeMessage extends BaseWebRTCMessage {
  type: 'shake'
}

export interface WhisperMessage extends BaseWebRTCMessage {
  type: 'whisper'
}

export type WebRTCMessage =
  | GhostChatMessage
  | PersistentChatMessage
  | ShakeMessage
  | WhisperMessage

// ============================================
// UI State Models
// ============================================

export interface Message {
  id: string
  type: 'ghost' | 'persistent'
  sender: string
  content: string
  timestamp: number
  isOwn: boolean
}

export interface Ghost {
  name: string
  isConnected: boolean
  isCurrentUser: boolean
}

export interface AppSettings {
  soundEnabled: boolean
  shakeEnabled: boolean
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

// ============================================
// Type Guards
// ============================================

export function isSignalingMessage(msg: unknown): msg is SignalingMessage {
  if (typeof msg !== 'object' || msg === null) return false
  const m = msg as Record<string, unknown>
  return typeof m.type === 'string' && isValidSignalingType(m.type)
}

export function isValidSignalingType(type: string): type is SignalingMessageType {
  const validTypes: SignalingMessageType[] = [
    'join', 'leave', 'ghost_list', 'ghost_joined', 'ghost_left',
    'offer', 'answer', 'ice_candidate', 'error'
  ]
  return validTypes.includes(type as SignalingMessageType)
}

export function isWebRTCMessage(msg: unknown): msg is WebRTCMessage {
  if (typeof msg !== 'object' || msg === null) return false
  const m = msg as Record<string, unknown>
  return (
    typeof m.type === 'string' &&
    isValidWebRTCType(m.type) &&
    typeof m.sender === 'string' &&
    typeof m.timestamp === 'number'
  )
}

export function isValidWebRTCType(type: string): type is WebRTCMessageType {
  const validTypes: WebRTCMessageType[] = [
    'ghost_message', 'persistent_message', 'shake', 'whisper'
  ]
  return validTypes.includes(type as WebRTCMessageType)
}

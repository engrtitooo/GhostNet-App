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

// RTCSessionDescriptionInit and RTCIceCandidateInit types for Node.js
export interface RTCSessionDescriptionInit {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback'
  sdp?: string
}

export interface RTCIceCandidateInit {
  candidate?: string
  sdpMid?: string | null
  sdpMLineIndex?: number | null
  usernameFragment?: string | null
}

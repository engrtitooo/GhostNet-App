/**
 * Message serialization and deserialization utilities
 * Requirements: 11.1, 11.2, 11.3, 12.1
 */

import type {
  WebRTCMessage,
  WebRTCMessageType,
  GhostChatMessage,
  PersistentChatMessage,
  ShakeMessage,
  WhisperMessage,
} from './types'

// Valid WebRTC message types
const VALID_WEBRTC_TYPES: WebRTCMessageType[] = [
  'ghost_message',
  'persistent_message',
  'shake',
  'whisper',
]

/**
 * Serialize a WebRTC message to JSON string
 * Ensures all required fields are present: type, sender, timestamp, and content (for chat messages)
 */
export function serializeMessage(message: WebRTCMessage): string {
  return JSON.stringify(message)
}

/**
 * Deserialize a JSON string to a WebRTC message
 * Returns null if the message is invalid or has an unknown type
 */
export function deserializeMessage(data: string): WebRTCMessage | null {
  try {
    const parsed = JSON.parse(data)

    if (!isValidWebRTCMessage(parsed)) {
      return null
    }

    return parsed as WebRTCMessage
  } catch {
    return null
  }
}

/**
 * Check if a parsed object is a valid WebRTC message
 */
export function isValidWebRTCMessage(obj: unknown): obj is WebRTCMessage {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const msg = obj as Record<string, unknown>

  // Check required base fields
  if (typeof msg.type !== 'string') return false
  if (typeof msg.sender !== 'string') return false
  if (typeof msg.timestamp !== 'number') return false

  // Check if type is valid
  if (!VALID_WEBRTC_TYPES.includes(msg.type as WebRTCMessageType)) {
    return false
  }

  // For chat messages, content is required
  if (msg.type === 'ghost_message' || msg.type === 'persistent_message') {
    if (typeof msg.content !== 'string') return false
  }

  return true
}

/**
 * Check if a message type is a known WebRTC message type
 */
export function isKnownMessageType(type: string): type is WebRTCMessageType {
  return VALID_WEBRTC_TYPES.includes(type as WebRTCMessageType)
}

/**
 * Create a ghost message
 */
export function createGhostMessage(sender: string, content: string): GhostChatMessage {
  return {
    type: 'ghost_message',
    sender,
    content,
    timestamp: Date.now(),
  }
}

/**
 * Create a persistent message
 */
export function createPersistentMessage(sender: string, content: string): PersistentChatMessage {
  return {
    type: 'persistent_message',
    sender,
    content,
    timestamp: Date.now(),
  }
}

/**
 * Create a shake message
 */
export function createShakeMessage(sender: string): ShakeMessage {
  return {
    type: 'shake',
    sender,
    timestamp: Date.now(),
  }
}

/**
 * Create a whisper message
 */
export function createWhisperMessage(sender: string): WhisperMessage {
  return {
    type: 'whisper',
    sender,
    timestamp: Date.now(),
  }
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

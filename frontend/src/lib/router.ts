/**
 * Message type router for WebRTC messages
 * Requirements: 12.2, 12.3
 */

import type { WebRTCMessage, GhostChatMessage, PersistentChatMessage, ShakeMessage, WhisperMessage } from './types'
import { isKnownMessageType } from './messages'

/**
 * Message handlers interface
 */
export interface MessageHandlers {
  onGhostMessage?: (message: GhostChatMessage) => void
  onPersistentMessage?: (message: PersistentChatMessage) => void
  onShake?: (message: ShakeMessage) => void
  onWhisper?: (message: WhisperMessage) => void
  onUnknown?: (message: unknown) => void
}

/**
 * Route a WebRTC message to the appropriate handler based on its type.
 * Unknown message types are safely ignored (optionally logged via onUnknown handler).
 *
 * @param message - The message to route
 * @param handlers - Object containing handler functions for each message type
 * @returns true if the message was handled, false if it was unknown/ignored
 */
export function routeMessage(message: WebRTCMessage | unknown, handlers: MessageHandlers): boolean {
  // Check if message is an object with a type field
  if (typeof message !== 'object' || message === null) {
    handlers.onUnknown?.(message)
    return false
  }

  const msg = message as Record<string, unknown>

  // Check if type is known
  if (typeof msg.type !== 'string' || !isKnownMessageType(msg.type)) {
    console.log(`Ignoring unknown message type: ${msg.type}`)
    handlers.onUnknown?.(message)
    return false
  }

  // Route to appropriate handler
  switch (msg.type) {
    case 'ghost_message':
      handlers.onGhostMessage?.(message as GhostChatMessage)
      return true

    case 'persistent_message':
      handlers.onPersistentMessage?.(message as PersistentChatMessage)
      return true

    case 'shake':
      handlers.onShake?.(message as ShakeMessage)
      return true

    case 'whisper':
      handlers.onWhisper?.(message as WhisperMessage)
      return true

    default:
      // This shouldn't happen if isKnownMessageType is correct
      handlers.onUnknown?.(message)
      return false
  }
}

/**
 * Create a message router with pre-configured handlers
 */
export function createMessageRouter(handlers: MessageHandlers) {
  return (message: WebRTCMessage | unknown) => routeMessage(message, handlers)
}

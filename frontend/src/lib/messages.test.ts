import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  serializeMessage,
  deserializeMessage,
  isValidWebRTCMessage,
  isKnownMessageType,
} from './messages'
import type { WebRTCMessage, GhostChatMessage, PersistentChatMessage, ShakeMessage, WhisperMessage } from './types'

/**
 * **Feature: ghostnet, Property 8: Message Serialization Round-Trip**
 * **Validates: Requirements 11.1, 11.2, 11.3, 12.1**
 *
 * For any valid WebRTCMessage object, serializing to JSON and then deserializing back
 * SHALL produce an equivalent object with all fields (type, sender, content if applicable,
 * timestamp) preserved.
 */
describe('Message Serialization Round-Trip', () => {
  // Arbitrary for non-empty strings (for sender and content)
  const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 100 })

  // Arbitrary for timestamps (positive integers)
  const timestampArb = fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER })

  // Arbitrary for ghost messages
  const ghostMessageArb: fc.Arbitrary<GhostChatMessage> = fc.record({
    type: fc.constant('ghost_message' as const),
    sender: nonEmptyStringArb,
    content: nonEmptyStringArb,
    timestamp: timestampArb,
  })

  // Arbitrary for persistent messages
  const persistentMessageArb: fc.Arbitrary<PersistentChatMessage> = fc.record({
    type: fc.constant('persistent_message' as const),
    sender: nonEmptyStringArb,
    content: nonEmptyStringArb,
    timestamp: timestampArb,
  })

  // Arbitrary for shake messages
  const shakeMessageArb: fc.Arbitrary<ShakeMessage> = fc.record({
    type: fc.constant('shake' as const),
    sender: nonEmptyStringArb,
    timestamp: timestampArb,
  })

  // Arbitrary for whisper messages
  const whisperMessageArb: fc.Arbitrary<WhisperMessage> = fc.record({
    type: fc.constant('whisper' as const),
    sender: nonEmptyStringArb,
    timestamp: timestampArb,
  })

  // Combined arbitrary for any valid WebRTC message
  const webrtcMessageArb: fc.Arbitrary<WebRTCMessage> = fc.oneof(
    ghostMessageArb,
    persistentMessageArb,
    shakeMessageArb,
    whisperMessageArb
  )

  it('should round-trip ghost messages correctly', () => {
    fc.assert(
      fc.property(ghostMessageArb, (message) => {
        const serialized = serializeMessage(message)
        const deserialized = deserializeMessage(serialized)

        expect(deserialized).not.toBeNull()
        expect(deserialized).toEqual(message)
      }),
      { numRuns: 100 }
    )
  })

  it('should round-trip persistent messages correctly', () => {
    fc.assert(
      fc.property(persistentMessageArb, (message) => {
        const serialized = serializeMessage(message)
        const deserialized = deserializeMessage(serialized)

        expect(deserialized).not.toBeNull()
        expect(deserialized).toEqual(message)
      }),
      { numRuns: 100 }
    )
  })

  it('should round-trip shake messages correctly', () => {
    fc.assert(
      fc.property(shakeMessageArb, (message) => {
        const serialized = serializeMessage(message)
        const deserialized = deserializeMessage(serialized)

        expect(deserialized).not.toBeNull()
        expect(deserialized).toEqual(message)
      }),
      { numRuns: 100 }
    )
  })

  it('should round-trip whisper messages correctly', () => {
    fc.assert(
      fc.property(whisperMessageArb, (message) => {
        const serialized = serializeMessage(message)
        const deserialized = deserializeMessage(serialized)

        expect(deserialized).not.toBeNull()
        expect(deserialized).toEqual(message)
      }),
      { numRuns: 100 }
    )
  })

  it('should round-trip any valid WebRTC message correctly', () => {
    fc.assert(
      fc.property(webrtcMessageArb, (message) => {
        const serialized = serializeMessage(message)
        const deserialized = deserializeMessage(serialized)

        expect(deserialized).not.toBeNull()
        expect(deserialized!.type).toBe(message.type)
        expect(deserialized!.sender).toBe(message.sender)
        expect(deserialized!.timestamp).toBe(message.timestamp)

        // Check content for chat messages
        if (message.type === 'ghost_message' || message.type === 'persistent_message') {
          expect((deserialized as GhostChatMessage | PersistentChatMessage).content).toBe(message.content)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('should preserve all required fields after serialization', () => {
    fc.assert(
      fc.property(webrtcMessageArb, (message) => {
        const serialized = serializeMessage(message)
        const parsed = JSON.parse(serialized)

        // All messages must have type, sender, timestamp
        expect(parsed.type).toBeDefined()
        expect(parsed.sender).toBeDefined()
        expect(parsed.timestamp).toBeDefined()

        // Chat messages must have content
        if (message.type === 'ghost_message' || message.type === 'persistent_message') {
          expect(parsed.content).toBeDefined()
        }
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: ghostnet, Property 9: Message Type Routing**
 * **Validates: Requirements 12.2**
 *
 * For any received WebRTC message with a known type, the message handler SHALL route
 * the message to the correct handler function based on the type field value.
 */
describe('Message Type Routing', () => {
  const knownTypes = ['ghost_message', 'persistent_message', 'shake', 'whisper']
  const unknownTypes = ['unknown', 'chat', 'message', 'ping', 'pong', 'hello', '']

  it('should recognize all known message types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...knownTypes),
        (type) => {
          expect(isKnownMessageType(type)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject unknown message types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...unknownTypes),
        (type) => {
          expect(isKnownMessageType(type)).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject arbitrary strings that are not known types', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !knownTypes.includes(s)),
        (type) => {
          expect(isKnownMessageType(type)).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should validate messages with correct type field', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constantFrom(...knownTypes),
          sender: fc.string({ minLength: 1 }),
          timestamp: fc.integer({ min: 0 }),
          content: fc.string({ minLength: 1 }),
        }),
        (msg) => {
          // For shake and whisper, content is not required but won't break validation
          const isValid = isValidWebRTCMessage(msg)
          expect(isValid).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject messages with invalid type field', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.string().filter(s => !knownTypes.includes(s)),
          sender: fc.string({ minLength: 1 }),
          timestamp: fc.integer({ min: 0 }),
          content: fc.string({ minLength: 1 }),
        }),
        (msg) => {
          const isValid = isValidWebRTCMessage(msg)
          expect(isValid).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })
})

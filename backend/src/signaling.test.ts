import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { isValidServerMessageType } from './signaling.js'

/**
 * **Feature: ghostnet, Property 12: Signaling Server Message Scope**
 * **Validates: Requirements 15.3**
 *
 * For any message received by the signaling server, the server SHALL only process
 * messages of types: join, leave, offer, answer, and ice_candidate.
 * All other message types SHALL be ignored.
 */
describe('Signaling Server Message Scope', () => {
  // Valid signaling types that the server should process
  const validSignalingTypes = ['join', 'leave', 'offer', 'answer', 'ice_candidate']

  // WebRTC message types that should NOT be processed by the server
  const webrtcMessageTypes = ['ghost_message', 'persistent_message', 'shake', 'whisper']

  it('should accept all valid signaling message types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...validSignalingTypes),
        (type) => {
          expect(isValidServerMessageType(type)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject all WebRTC chat message types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...webrtcMessageTypes),
        (type) => {
          expect(isValidServerMessageType(type)).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject arbitrary unknown message types', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s =>
          !validSignalingTypes.includes(s) &&
          !webrtcMessageTypes.includes(s)
        ),
        (type) => {
          expect(isValidServerMessageType(type)).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should only return true for exactly the 5 valid signaling types', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (type) => {
          const isValid = isValidServerMessageType(type)
          const shouldBeValid = validSignalingTypes.includes(type)
          expect(isValid).toBe(shouldBeValid)
        }
      ),
      { numRuns: 100 }
    )
  })
})

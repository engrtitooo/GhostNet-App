import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { validateGhostName } from './validation'

/**
 * **Feature: ghostnet, Property 1: Ghost Name Validation**
 * **Validates: Requirements 1.2**
 *
 * For any string input, the ghost name validation function SHALL accept the string
 * if and only if it is between 3 and 20 characters (inclusive) and contains only
 * alphanumeric characters, hyphens, or underscores.
 */
describe('Ghost Name Validation', () => {
  // Valid character set for ghost names
  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'

  // Arbitrary for valid ghost names (3-20 chars, valid characters only)
  const validGhostNameArb = fc.stringOf(
    fc.constantFrom(...validChars.split('')),
    { minLength: 3, maxLength: 20 }
  )

  // Arbitrary for strings that are too short (1-2 chars)
  const tooShortArb = fc.stringOf(
    fc.constantFrom(...validChars.split('')),
    { minLength: 1, maxLength: 2 }
  )

  // Arbitrary for strings that are too long (21+ chars)
  const tooLongArb = fc.stringOf(
    fc.constantFrom(...validChars.split('')),
    { minLength: 21, maxLength: 50 }
  )

  // Invalid characters (anything not in validChars)
  const invalidChars = '!@#$%^&*()+=[]{}|;:\'",.<>?/\\`~ '

  it('should accept all valid ghost names (3-20 chars, valid characters)', () => {
    fc.assert(
      fc.property(validGhostNameArb, (name) => {
        const result = validateGhostName(name)
        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      }),
      { numRuns: 100 }
    )
  })

  it('should reject names that are too short (less than 3 characters)', () => {
    fc.assert(
      fc.property(tooShortArb, (name) => {
        const result = validateGhostName(name)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      }),
      { numRuns: 100 }
    )
  })

  it('should reject names that are too long (more than 20 characters)', () => {
    fc.assert(
      fc.property(tooLongArb, (name) => {
        const result = validateGhostName(name)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      }),
      { numRuns: 100 }
    )
  })

  it('should reject names containing invalid characters', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          // Valid prefix (at least 1 char)
          fc.stringOf(fc.constantFrom(...validChars.split('')), { minLength: 1, maxLength: 5 }),
          // Invalid character
          fc.constantFrom(...invalidChars.split('')),
          // Valid suffix (at least 1 char)
          fc.stringOf(fc.constantFrom(...validChars.split('')), { minLength: 1, maxLength: 5 })
        ),
        ([prefix, invalidChar, suffix]) => {
          const name = prefix + invalidChar + suffix
          const result = validateGhostName(name)
          expect(result.isValid).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject empty strings and whitespace-only strings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', ' ', '  ', '\t', '\n', '   '),
        (name) => {
          const result = validateGhostName(name)
          expect(result.isValid).toBe(false)
          expect(result.error).toBeDefined()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should correctly validate any arbitrary string based on the rules', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const result = validateGhostName(name)
        const trimmed = name.trim()

        // Calculate expected validity
        const hasValidLength = trimmed.length >= 3 && trimmed.length <= 20
        const hasValidChars = /^[a-zA-Z0-9_-]+$/.test(trimmed)
        const expectedValid = hasValidLength && hasValidChars

        expect(result.isValid).toBe(expectedValid)
      }),
      { numRuns: 100 }
    )
  })
})

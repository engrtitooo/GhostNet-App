/**
 * Ghost name validation utilities
 * Requirements: 1.2, 1.3
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// Ghost name constraints
const MIN_LENGTH = 3
const MAX_LENGTH = 20
const VALID_PATTERN = /^[a-zA-Z0-9_-]+$/

/**
 * Validates a ghost name according to the requirements:
 * - Between 3 and 20 characters (inclusive)
 * - Contains only alphanumeric characters, hyphens, or underscores
 *
 * @param name - The ghost name to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateGhostName(name: string): ValidationResult {
  // Check for empty or whitespace-only input
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Ghost name is required'
    }
  }

  const trimmedName = name.trim()

  // Check minimum length
  if (trimmedName.length < MIN_LENGTH) {
    return {
      isValid: false,
      error: `Ghost name must be at least ${MIN_LENGTH} characters`
    }
  }

  // Check maximum length
  if (trimmedName.length > MAX_LENGTH) {
    return {
      isValid: false,
      error: `Ghost name must be at most ${MAX_LENGTH} characters`
    }
  }

  // Check valid characters (alphanumeric, hyphens, underscores)
  if (!VALID_PATTERN.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Ghost name can only contain letters, numbers, hyphens, and underscores'
    }
  }

  return { isValid: true }
}

/**
 * Check if a character is valid for ghost names
 */
export function isValidGhostNameChar(char: string): boolean {
  return VALID_PATTERN.test(char)
}

/**
 * Get the ghost name constraints for display
 */
export function getGhostNameConstraints() {
  return {
    minLength: MIN_LENGTH,
    maxLength: MAX_LENGTH,
    allowedChars: 'letters, numbers, hyphens (-), and underscores (_)'
  }
}

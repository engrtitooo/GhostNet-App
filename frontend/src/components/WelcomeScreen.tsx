/**
 * WelcomeScreen - Ghost name entry screen
 * Requirements: 1.1, 1.2, 1.3, 9.1
 */

import { useState, FormEvent } from 'react'
import { validateGhostName, getGhostNameConstraints } from '../lib/validation'

interface WelcomeScreenProps {
  onJoin: (name: string) => Promise<boolean>
  isConnecting: boolean
  error: string | null
  webrtcSupported: boolean
}

export function WelcomeScreen({ onJoin, isConnecting, error, webrtcSupported }: WelcomeScreenProps) {
  const [ghostName, setGhostName] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const constraints = getGhostNameConstraints()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate ghost name
    const validation = validateGhostName(ghostName)
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid ghost name')
      return
    }

    setValidationError(null)
    await onJoin(ghostName.trim())
  }

  const displayError = validationError || error

  return (
    <div className="min-h-screen bg-ghost-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-float">👻</div>
          <h1 className="text-5xl font-bold text-ghost-purple-light animate-glow mb-2">
            GhostNet
          </h1>
          <p className="text-ghost-gray-light text-lg">
            Local peer-to-peer ghost chat
          </p>
        </div>

        {/* WebRTC Not Supported Warning */}
        {!webrtcSupported && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-300">
              ⚠️ Your browser does not support WebRTC. Please use a modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        )}

        {/* Join Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ghostName" className="block text-ghost-green-neon text-sm font-medium mb-2">
              Choose your ghost name
            </label>
            <input
              type="text"
              id="ghostName"
              value={ghostName}
              onChange={(e) => {
                setGhostName(e.target.value)
                setValidationError(null)
              }}
              placeholder="e.g., Phantom-23, ShadowSpirit"
              disabled={isConnecting || !webrtcSupported}
              className={`
                w-full px-4 py-3 rounded-lg
                bg-ghost-dark border-2
                text-white placeholder-ghost-gray-light
                focus:outline-none focus:ring-2 focus:ring-ghost-purple-light
                transition-all duration-200
                ${displayError 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-ghost-purple hover:border-ghost-purple-light focus:border-ghost-purple-light'
                }
                ${(isConnecting || !webrtcSupported) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              maxLength={constraints.maxLength}
              autoFocus
            />
            <p className="text-ghost-gray-light text-xs mt-2">
              {constraints.minLength}-{constraints.maxLength} characters, {constraints.allowedChars}
            </p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">
                {displayError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isConnecting || !webrtcSupported || !ghostName.trim()}
            className={`
              w-full py-4 rounded-lg font-bold text-lg
              transition-all duration-200
              ${(isConnecting || !webrtcSupported || !ghostName.trim())
                ? 'bg-ghost-gray text-ghost-gray-light cursor-not-allowed'
                : 'bg-ghost-purple hover:bg-ghost-purple-light text-white hover:shadow-lg hover:shadow-ghost-purple/50'
              }
            `}
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Entering the haunted lobby...
              </span>
            ) : (
              '🚪 Enter the Haunted Lobby'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-ghost-gray-light text-sm mt-8">
          Connect with other ghosts at ghostnet.app
        </p>
      </div>
    </div>
  )
}

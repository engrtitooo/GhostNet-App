/**
 * MessageInput - Text input and action buttons
 * Requirements: 5.1, 6.1, 7.1, 8.1
 */

import { useState, FormEvent, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSendGhostMessage: (text: string) => void
  onSendPersistentMessage: (text: string) => void
  onTriggerShake: () => void
  onTriggerWhisper: () => void
  disabled?: boolean
}

export function MessageInput({
  onSendGhostMessage,
  onSendPersistentMessage,
  onTriggerShake,
  onTriggerWhisper,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent, isPersistent: boolean) => {
    e.preventDefault()
    if (!message.trim()) return

    if (isPersistent) {
      onSendPersistentMessage(message)
    } else {
      onSendGhostMessage(message)
    }
    setMessage('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (message.trim()) {
        onSendGhostMessage(message)
        setMessage('')
      }
    }
  }

  return (
    <div className="bg-ghost-dark border-t border-ghost-purple/30 p-4">
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-3">
        {/* Text Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a spooky message..."
            disabled={disabled}
            className={`
              flex-1 px-4 py-3 rounded-lg
              bg-ghost-darker border border-ghost-purple/30
              text-white placeholder-ghost-gray-light
              focus:outline-none focus:ring-2 focus:ring-ghost-purple-light focus:border-transparent
              transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Ghost Message Button */}
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className={`
              flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${disabled || !message.trim()
                ? 'bg-ghost-gray text-ghost-gray-light cursor-not-allowed'
                : 'bg-ghost-purple hover:bg-ghost-purple-light text-white hover:shadow-lg hover:shadow-ghost-purple/30'
              }
            `}
          >
            👻 Ghost Message
          </button>

          {/* Persistent Message Button */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={disabled || !message.trim()}
            className={`
              flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${disabled || !message.trim()
                ? 'bg-ghost-gray text-ghost-gray-light cursor-not-allowed'
                : 'bg-ghost-green/20 hover:bg-ghost-green/30 text-ghost-green-neon border border-ghost-green/30'
              }
            `}
          >
            📝 Persistent
          </button>

          {/* Shake Button */}
          <button
            type="button"
            onClick={onTriggerShake}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${disabled
                ? 'bg-ghost-gray text-ghost-gray-light cursor-not-allowed'
                : 'bg-orange-900/30 hover:bg-orange-800/30 text-orange-400 border border-orange-500/30'
              }
            `}
            title="Shake everyone's screen!"
          >
            📳 Shake
          </button>

          {/* Whisper Button */}
          <button
            type="button"
            onClick={onTriggerWhisper}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${disabled
                ? 'bg-ghost-gray text-ghost-gray-light cursor-not-allowed'
                : 'bg-blue-900/30 hover:bg-blue-800/30 text-blue-400 border border-blue-500/30'
              }
            `}
            title="Play a spooky whisper sound!"
          >
            👂 Whisper
          </button>
        </div>
      </form>
    </div>
  )
}

/**
 * GhostMessage - Ephemeral message with ghostly effects
 * Requirements: 5.2, 5.3, 5.4, 9.3
 */

import type { Message } from '../lib/types'

interface GhostMessageProps {
  message: Message
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export function GhostMessage({ message }: GhostMessageProps) {
  return (
    <div className={`
      animate-fade-in
      ${message.isOwn ? 'ml-auto' : 'mr-auto'}
      max-w-[80%] sm:max-w-[70%]
    `}>
      <div className={`
        relative p-4 rounded-2xl
        bg-ghost-purple/20 backdrop-blur-sm
        border border-ghost-purple/40
        shadow-lg shadow-ghost-purple/20
        animate-glow
        ${message.isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'}
      `}>
        {/* Ghost indicator */}
        <div className="absolute -top-2 -left-2 text-xl opacity-70">
          👻
        </div>

        {/* Sender */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`
            text-sm font-medium
            ${message.isOwn ? 'text-ghost-green-neon' : 'text-ghost-purple-light'}
          `}>
            {message.sender}
          </span>
          <span className="text-xs text-ghost-gray-light">
            {formatTime(message.timestamp)}
          </span>
          <span className="text-xs text-ghost-purple-light/60 ml-auto">
            ✨ fading...
          </span>
        </div>

        {/* Content */}
        <p className="text-white/90 break-words">
          {message.content}
        </p>
      </div>
    </div>
  )
}

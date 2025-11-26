/**
 * PersistentMessage - Standard message that stays in history
 * Requirements: 6.2, 6.3
 */

import type { Message } from '../lib/types'

interface PersistentMessageProps {
  message: Message
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export function PersistentMessage({ message }: PersistentMessageProps) {
  return (
    <div className={`
      animate-fade-in
      ${message.isOwn ? 'ml-auto' : 'mr-auto'}
      max-w-[80%] sm:max-w-[70%]
    `}>
      <div className={`
        p-4 rounded-2xl
        bg-ghost-dark/80
        border border-ghost-gray/30
        ${message.isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'}
      `}>
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
        </div>

        {/* Content */}
        <p className="text-white break-words">
          {message.content}
        </p>
      </div>
    </div>
  )
}

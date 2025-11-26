/**
 * ChatArea - Message display area with shake animation
 * Requirements: 5.2, 6.2, 7.2
 */

import { useEffect, useRef } from 'react'
import type { Message } from '../lib/types'
import { GhostMessage } from './GhostMessage'
import { PersistentMessage } from './PersistentMessage'

interface ChatAreaProps {
  messages: Message[]
  isShaking: boolean
}

export function ChatArea({ messages, isShaking }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={`
      flex-1 overflow-y-auto p-4
      ${isShaking ? 'animate-shake' : ''}
    `}>
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-ghost-gray-light">
            <span className="text-6xl block mb-4">💬</span>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-2">Send a ghost message to start haunting!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            message.type === 'ghost' ? (
              <GhostMessage key={message.id} message={message} />
            ) : (
              <PersistentMessage key={message.id} message={message} />
            )
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}

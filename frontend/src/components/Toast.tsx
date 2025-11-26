/**
 * Toast - Notification component
 * Requirements: 2.5, 10.3, 14.2, 14.3
 */

import { useEffect, useState } from 'react'

export type ToastType = 'error' | 'warning' | 'info' | 'success'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

const typeStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
  error: {
    bg: 'bg-red-900/80',
    border: 'border-red-500',
    icon: '❌',
  },
  warning: {
    bg: 'bg-yellow-900/80',
    border: 'border-yellow-500',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-blue-900/80',
    border: 'border-blue-500',
    icon: 'ℹ️',
  },
  success: {
    bg: 'bg-green-900/80',
    border: 'border-green-500',
    icon: '✅',
  },
}

export function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const styles = typeStyles[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) {
    return null
  }

  return (
    <div className={`
      fixed bottom-4 right-4 z-50
      flex items-center gap-3 px-4 py-3 rounded-lg
      ${styles.bg} ${styles.border} border
      text-white shadow-lg
      animate-fade-in
      transition-opacity duration-300
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      <span className="text-xl">{styles.icon}</span>
      <p className="text-sm">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose?.(), 300)
        }}
        className="ml-2 text-white/60 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}

interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="bg-red-900/50 border-b border-red-500 px-4 py-2 text-center">
      <p className="text-red-300 text-sm">
        ⚠️ {message}
      </p>
    </div>
  )
}

interface PerformanceWarningProps {
  ghostCount: number
}

export function PerformanceWarning({ ghostCount }: PerformanceWarningProps) {
  if (ghostCount <= 8) return null

  return (
    <div className="bg-yellow-900/50 border-b border-yellow-500 px-4 py-2 text-center">
      <p className="text-yellow-300 text-sm">
        ⚠️ {ghostCount} ghosts connected. Performance may be affected with large groups.
      </p>
    </div>
  )
}

/**
 * Header - App header with title, user info, and settings
 * Requirements: 9.2, 13.1
 */

interface HeaderProps {
  ghostName: string
  soundEnabled: boolean
  shakeEnabled: boolean
  onSoundToggle: (enabled: boolean) => void
  onShakeToggle: (enabled: boolean) => void
  onLeave: () => void
}

export function Header({
  ghostName,
  soundEnabled,
  shakeEnabled,
  onSoundToggle,
  onShakeToggle,
  onLeave,
}: HeaderProps) {
  return (
    <header className="bg-ghost-dark border-b border-ghost-purple/30 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">👻</span>
          <h1 className="text-2xl font-bold text-ghost-purple-light">GhostNet</h1>
        </div>

        {/* User Info and Settings */}
        <div className="flex items-center gap-4">
          {/* Settings Toggles */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onSoundToggle(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled 
                  ? 'bg-ghost-purple/30 text-ghost-green-neon' 
                  : 'bg-ghost-gray/30 text-ghost-gray-light'
              }`}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => onShakeToggle(!shakeEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                shakeEnabled 
                  ? 'bg-ghost-purple/30 text-ghost-green-neon' 
                  : 'bg-ghost-gray/30 text-ghost-gray-light'
              }`}
              title={shakeEnabled ? 'Disable shake' : 'Enable shake'}
            >
              {shakeEnabled ? '📳' : '📴'}
            </button>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-2 bg-ghost-purple/20 px-3 py-1.5 rounded-full">
            <span className="text-ghost-green-neon">👤</span>
            <span className="text-white font-medium">{ghostName}</span>
          </div>

          {/* Leave Button */}
          <button
            onClick={onLeave}
            className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800/50 text-red-300 rounded-lg transition-colors text-sm"
            title="Leave lobby"
          >
            Leave
          </button>
        </div>
      </div>
    </header>
  )
}

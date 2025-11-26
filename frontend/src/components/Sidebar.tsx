/**
 * Sidebar - Connected ghosts list
 * Requirements: 4.1, 4.4, 16.1, 16.2
 */

interface SidebarProps {
  ghosts: string[]
  currentUser: string
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ ghosts, currentUser, isOpen, onClose }: SidebarProps) {
  const allGhosts = [currentUser, ...ghosts]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-ghost-dark border-r border-ghost-purple/30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-ghost-purple/30 flex items-center justify-between">
          <h2 className="text-ghost-green-neon font-semibold flex items-center gap-2">
            <span>👥</span>
            <span>Ghosts in Lobby</span>
          </h2>
          <span className="bg-ghost-purple/30 text-ghost-purple-light px-2 py-0.5 rounded-full text-sm">
            {allGhosts.length}
          </span>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-ghost-gray-light hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Ghost List */}
        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {allGhosts.map((ghost) => (
              <li
                key={ghost}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg
                  ${ghost === currentUser 
                    ? 'bg-ghost-purple/30 border border-ghost-purple/50' 
                    : 'hover:bg-ghost-gray/30'
                  }
                `}
              >
                <span className="text-xl">
                  {ghost === currentUser ? '👻' : '🔮'}
                </span>
                <span className={`
                  flex-1 truncate
                  ${ghost === currentUser ? 'text-ghost-green-neon font-medium' : 'text-white'}
                `}>
                  {ghost}
                </span>
                {ghost === currentUser && (
                  <span className="text-xs text-ghost-purple-light">(you)</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ghost-purple/30">
          <p className="text-ghost-gray-light text-xs text-center">
            {ghosts.length === 0 
              ? 'Waiting for other ghosts...' 
              : `${ghosts.length} other ghost${ghosts.length === 1 ? '' : 's'} connected`
            }
          </p>
        </div>
      </aside>
    </>
  )
}

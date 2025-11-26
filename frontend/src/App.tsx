/**
 * GhostNet App - Main application component
 * Requirements: 1.4, 16.1, 16.2
 */

import { useState } from 'react'
import { useGhostNet } from './hooks/useGhostNet'
import { WelcomeScreen } from './components/WelcomeScreen'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import { MessageInput } from './components/MessageInput'
import { Toast, ErrorBanner, PerformanceWarning } from './components/Toast'

function App() {
  const {
    ghostName,
    connectedGhosts,
    messages,
    connectionState,
    error,
    webrtcSupported,
    soundEnabled,
    shakeEnabled,
    setSoundEnabled,
    setShakeEnabled,
    joinLobby,
    leaveLobby,
    sendGhostMessage,
    sendPersistentMessage,
    triggerShake,
    triggerWhisper,
    isShaking,
  } = useGhostNet()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Show welcome screen if not joined
  if (!ghostName) {
    return (
      <WelcomeScreen
        onJoin={joinLobby}
        isConnecting={connectionState === 'connecting'}
        error={error}
        webrtcSupported={webrtcSupported}
      />
    )
  }

  const totalGhosts = connectedGhosts.length + 1 // Include self

  return (
    <div className="h-screen flex flex-col bg-ghost-darker">
      {/* Error Banner */}
      {connectionState === 'error' && error && (
        <ErrorBanner message={error} />
      )}

      {/* Performance Warning */}
      <PerformanceWarning ghostCount={totalGhosts} />

      {/* Header */}
      <Header
        ghostName={ghostName}
        soundEnabled={soundEnabled}
        shakeEnabled={shakeEnabled}
        onSoundToggle={setSoundEnabled}
        onShakeToggle={setShakeEnabled}
        onLeave={leaveLobby}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          ghosts={connectedGhosts}
          currentUser={ghostName}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile sidebar toggle */}
          <div className="lg:hidden p-2 border-b border-ghost-purple/30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-3 py-1.5 bg-ghost-purple/20 text-ghost-purple-light rounded-lg text-sm"
            >
              👥 {totalGhosts} Ghost{totalGhosts !== 1 ? 's' : ''}
            </button>
          </div>

          {/* Messages */}
          <ChatArea messages={messages} isShaking={isShaking} />

          {/* Input */}
          <MessageInput
            onSendGhostMessage={sendGhostMessage}
            onSendPersistentMessage={sendPersistentMessage}
            onTriggerShake={triggerShake}
            onTriggerWhisper={triggerWhisper}
            disabled={connectionState !== 'connected'}
          />
        </main>
      </div>

      {/* Toast Notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  )
}

export default App

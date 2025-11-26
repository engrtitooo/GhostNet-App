# Implementation Plan

- [x] 1. Set up project structure and tooling



  - [x] 1.1 Initialize monorepo structure with frontend and backend directories


    - Create `/frontend` and `/backend` directories
    - Initialize package.json in each directory
    - Set up TypeScript configuration for both
    - _Requirements: 15.3_
  - [x] 1.2 Configure frontend with Vite, React, TypeScript, and Tailwind CSS


    - Initialize Vite React TypeScript template
    - Install and configure Tailwind CSS with Halloween color palette
    - Set up ESLint and Prettier
    - _Requirements: 9.1_
  - [x] 1.3 Configure backend with Express, TypeScript, and WebSocket


    - Initialize Node.js TypeScript project
    - Install Express, ws, and TypeScript dependencies
    - Set up build and dev scripts
    - _Requirements: 2.1_
  - [x] 1.4 Create shared types package for signaling and WebRTC messages


    - Define SignalingMessage types
    - Define WebRTCMessage types
    - Export types for use in both frontend and backend
    - _Requirements: 11.3, 12.1_

- [ ] 2. Implement backend signaling server
  - [ ] 2.1 Create Express server with WebSocket support
    - Set up Express app with CORS
    - Initialize WebSocket server on same port
    - Add health check endpoint
    - _Requirements: 2.1_
  - [ ] 2.2 Implement lobby manager for ghost tracking
    - Create LobbyManager class to track connected ghosts
    - Implement addGhost, removeGhost, getGhosts methods
    - Implement broadcast and sendTo methods
    - _Requirements: 2.3, 2.4_
  - [ ] 2.3 Implement signaling message handlers
    - Handle join messages and broadcast ghost presence
    - Handle offer/answer/ICE candidate relay
    - Handle disconnect and cleanup
    - _Requirements: 2.3, 2.4, 3.2, 3.3, 3.4_
  - [ ] 2.4 Write property test for signaling server message scope
    - **Property 12: Signaling Server Message Scope**
    - **Validates: Requirements 15.3**

- [ ] 3. Implement frontend core infrastructure
  - [ ] 3.1 Create validation utilities for ghost names
    - Implement validateGhostName function
    - Return validation result with error message if invalid
    - _Requirements: 1.2, 1.3_
  - [ ] 3.2 Write property test for ghost name validation
    - **Property 1: Ghost Name Validation**
    - **Validates: Requirements 1.2**
  - [ ] 3.3 Create message serialization utilities
    - Implement serializeMessage function
    - Implement deserializeMessage function with type guards
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ] 3.4 Write property test for message serialization round-trip
    - **Property 8: Message Serialization Round-Trip**
    - **Validates: Requirements 11.1, 11.2, 11.3, 12.1**
  - [ ] 3.5 Create message type router
    - Implement routeMessage function that dispatches based on type
    - Handle unknown types gracefully
    - _Requirements: 12.2, 12.3_
  - [ ] 3.6 Write property test for message type routing
    - **Property 9: Message Type Routing**
    - **Validates: Requirements 12.2**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement signaling client module
  - [ ] 5.1 Create SignalingClient class
    - Implement WebSocket connection management
    - Implement sendJoin, sendOffer, sendAnswer, sendIceCandidate methods
    - Set up event callbacks for received messages
    - _Requirements: 2.1, 2.2, 3.2, 3.3, 3.4_
  - [ ] 5.2 Add connection state management and error handling
    - Track connection state (disconnected, connecting, connected, error)
    - Handle WebSocket errors and reconnection
    - _Requirements: 2.5, 14.3_

- [ ] 6. Implement WebRTC peer manager module
  - [ ] 6.1 Create PeerManager class for WebRTC connections
    - Implement createPeerConnection with data channel setup
    - Implement createOffer and handleOffer methods
    - Implement handleAnswer and addIceCandidate methods
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ] 6.2 Implement message broadcasting
    - Implement broadcast method to send to all peers
    - Implement sendMessage for single peer
    - Set up onMessage callback for received data
    - _Requirements: 5.1, 6.1, 7.1, 8.1_
  - [ ] 6.3 Add peer connection state tracking
    - Track connected/disconnected state per peer
    - Emit events on peer connect/disconnect
    - _Requirements: 10.2_
  - [ ] 6.4 Add WebRTC capability detection
    - Check for RTCPeerConnection support on load
    - Return error if WebRTC is not supported
    - _Requirements: 14.1_

- [ ] 7. Implement useGhostNet custom hook
  - [ ] 7.1 Create useGhostNet hook with state management
    - Manage ghostName, connectedGhosts, messages state
    - Manage connectionState and error state
    - Manage settings (soundEnabled, shakeEnabled)
    - _Requirements: 4.1, 10.1, 13.1_
  - [ ] 7.2 Implement joinLobby action
    - Validate ghost name
    - Connect to signaling server
    - Set up peer connections with existing ghosts
    - _Requirements: 1.4, 2.1, 2.2, 3.1_
  - [ ] 7.3 Implement message sending actions
    - Implement sendGhostMessage and sendPersistentMessage
    - Implement triggerShake and triggerWhisper
    - Broadcast messages to all peers
    - _Requirements: 5.1, 6.1, 7.1, 8.1_
  - [ ] 7.4 Implement message receiving and effects
    - Handle incoming messages and add to state
    - Trigger shake animation when shake received (if enabled)
    - Trigger whisper sound when whisper received (if enabled)
    - _Requirements: 5.2, 7.2, 8.2, 13.2, 13.3_
  - [ ] 7.5 Implement ghost message auto-removal
    - Set timeout to remove ghost messages after 5 seconds
    - Keep persistent messages indefinitely
    - _Requirements: 5.4, 6.3_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement UI components - Welcome Screen
  - [ ] 9.1 Create WelcomeScreen component
    - Ghost name input field with validation
    - "Enter the Haunted Lobby" button
    - Display validation errors inline
    - Halloween-themed styling
    - _Requirements: 1.1, 1.2, 1.3, 9.1_

- [ ] 10. Implement UI components - Main Chat Layout
  - [ ] 10.1 Create Header component
    - Display "GhostNet" title with spooky styling
    - Display current user's ghost name
    - Settings toggles for sound and shake
    - _Requirements: 9.2, 13.1_
  - [ ] 10.2 Create Sidebar component
    - Display list of connected ghosts
    - Highlight current user's name
    - Responsive: collapse on mobile
    - _Requirements: 4.1, 4.4, 16.1, 16.2_
  - [ ] 10.3 Create ChatArea component
    - Message history container with scroll
    - Shake animation wrapper
    - _Requirements: 5.2, 6.2, 7.2_
  - [ ] 10.4 Create MessageInput component
    - Text input field
    - Send Ghost Message button
    - Send Persistent Message button
    - Shake Screen button
    - Ghost Whisper button
    - _Requirements: 5.1, 6.1, 7.1, 8.1_

- [ ] 11. Implement UI components - Messages and Effects
  - [ ] 11.1 Create GhostMessage component
    - Display sender, content, timestamp
    - Ghostly glow effect and fade-in animation
    - Fade-out animation before removal
    - _Requirements: 5.2, 5.3, 5.4, 9.3_
  - [ ] 11.2 Create PersistentMessage component
    - Display sender, content, timestamp
    - Standard message styling (no fade-out)
    - _Requirements: 6.2, 6.3_
  - [ ] 11.3 Implement screen shake CSS animation
    - Create shake keyframes animation
    - Apply to ChatArea when triggered
    - 500ms duration
    - _Requirements: 7.2_
  - [ ] 11.4 Add ghost whisper audio
    - Include short spooky audio file
    - Play on whisper signal (if sound enabled)
    - _Requirements: 8.2_

- [ ] 12. Implement error handling and notifications
  - [ ] 12.1 Create Toast/Notification component
    - Support error, warning, info variants
    - Auto-dismiss after timeout
    - _Requirements: 2.5, 10.3, 14.2, 14.3_
  - [ ] 12.2 Add WebRTC unsupported error banner
    - Display on app load if WebRTC not supported
    - Prevent lobby entry
    - _Requirements: 14.1_
  - [ ] 12.3 Add performance warning for large groups
    - Display notice when more than 8 ghosts connected
    - _Requirements: 15.2_

- [ ] 13. Wire up App component and routing
  - [ ] 13.1 Create App component with screen routing
    - Show WelcomeScreen when not joined
    - Show main chat layout when joined
    - Pass useGhostNet hook state to components
    - _Requirements: 1.4_
  - [ ] 13.2 Add responsive layout container
    - Full layout on desktop (sidebar + chat)
    - Collapsed sidebar on mobile
    - _Requirements: 16.1, 16.2_

- [ ] 14. Create README and documentation
  - [ ] 14.1 Write README.md
    - Project description and features
    - Tech stack overview
    - Local development instructions
    - Demo instructions (two browser windows)
    - Known limitations
    - _Requirements: All_

- [ ] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

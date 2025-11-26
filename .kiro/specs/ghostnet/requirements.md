# Requirements Document

## Introduction

GhostNet is a local, peer-to-peer "ghost chat" web application that enables users on the same local network to send spooky, Halloween-themed messages without relying on a centralized chat server. The application uses WebRTC for direct peer-to-peer messaging with a minimal signaling server for connection establishment. This hackathon prototype prioritizes clean code structure, fun UX, and demonstrable WebRTC capabilities.

## Glossary

- **Ghost**: A user connected to GhostNet, identified by a unique ghost name
- **Ghost Message**: A temporary text message that appears with spooky animation and auto-disappears after a configurable duration
- **Persistent Message**: A standard chat message that remains in the message history
- **Signaling Server**: A WebSocket-based backend that facilitates WebRTC connection establishment between peers
- **Lobby**: The single default chat room where all ghosts connect
- **Screen Shake**: A visual effect that causes the recipient's chat panel to shake briefly
- **Ghost Whisper**: An audio effect triggered on the recipient's device when receiving a special control message
- **Peer**: Another connected ghost with whom a WebRTC data channel connection is established
- **ICE Candidate**: Interactive Connectivity Establishment candidate used in WebRTC to find the best path for peer connection

## Requirements

### Requirement 1: Ghost Identity Selection

**User Story:** As a user, I want to choose a ghost name when joining GhostNet, so that I can be identified by other users in the haunted lobby.

#### Acceptance Criteria

1. WHEN a user first loads the application THEN the GhostNet System SHALL display a welcome screen with a ghost name input field and an "Enter the Haunted Lobby" button
2. WHEN a user submits a ghost name THEN the GhostNet System SHALL validate that the name is between 3 and 20 characters and contains only alphanumeric characters, hyphens, or underscores
3. IF a user submits an invalid ghost name THEN the GhostNet System SHALL display a validation error message and prevent lobby entry
4. WHEN a user submits a valid ghost name THEN the GhostNet System SHALL store the ghost name and navigate to the main chat screen

### Requirement 2: Signaling Server Connection

**User Story:** As a ghost, I want to connect to the signaling server automatically, so that I can discover and connect with other ghosts in the lobby.

#### Acceptance Criteria

1. WHEN a ghost enters the lobby THEN the GhostNet System SHALL establish a WebSocket connection to the signaling server
2. WHEN the WebSocket connection is established THEN the GhostNet System SHALL send a join message containing the ghost name to the signaling server
3. WHEN the signaling server receives a join message THEN the Signaling Server SHALL broadcast the new ghost's presence to all existing ghosts in the lobby
4. WHEN the signaling server receives a join message THEN the Signaling Server SHALL send the list of existing ghosts to the newly joined ghost
5. IF the WebSocket connection fails THEN the GhostNet System SHALL display an error notification to the user

### Requirement 3: WebRTC Peer Connection

**User Story:** As a ghost, I want to establish direct peer-to-peer connections with other ghosts, so that I can send and receive messages without server relay.

#### Acceptance Criteria

1. WHEN a new ghost joins the lobby THEN the GhostNet System SHALL initiate WebRTC peer connections with all existing ghosts using a mesh topology
2. WHEN initiating a peer connection THEN the GhostNet System SHALL create an offer, send it via the signaling server, and wait for an answer
3. WHEN receiving an offer from another ghost THEN the GhostNet System SHALL create an answer and send it back via the signaling server
4. WHEN ICE candidates are generated THEN the GhostNet System SHALL exchange ICE candidates via the signaling server
5. WHEN a WebRTC data channel is established THEN the GhostNet System SHALL mark the peer as connected and enable messaging

### Requirement 4: Ghost List Display

**User Story:** As a ghost, I want to see a list of all connected ghosts in the sidebar, so that I know who is available to chat with.

#### Acceptance Criteria

1. WHILE a ghost is in the lobby THEN the GhostNet System SHALL display a sidebar containing the list of all connected ghost names
2. WHEN a new ghost joins the lobby THEN the GhostNet System SHALL add the ghost name to the sidebar list within 2 seconds
3. WHEN a ghost leaves the lobby THEN the GhostNet System SHALL remove the ghost name from the sidebar list within 2 seconds
4. WHEN displaying the ghost list THEN the GhostNet System SHALL visually distinguish the current user's ghost name from other ghosts

### Requirement 5: Ghost Message Sending

**User Story:** As a ghost, I want to send temporary ghost messages that disappear after a few seconds, so that I can create a spooky ephemeral chat experience.

#### Acceptance Criteria

1. WHEN a ghost types a message and clicks "Send Ghost Message" THEN the GhostNet System SHALL broadcast the message to all connected peers via WebRTC data channels
2. WHEN a ghost message is sent or received THEN the GhostNet System SHALL display the message with sender name, text, and timestamp
3. WHEN a ghost message is displayed THEN the GhostNet System SHALL apply a spooky fade-in animation with a ghostly glow effect
4. WHEN a ghost message has been displayed for 5 seconds THEN the GhostNet System SHALL fade out and remove the message from the display

### Requirement 6: Persistent Message Sending

**User Story:** As a ghost, I want to send persistent messages that stay in the chat history, so that I can have conversations that remain visible.

#### Acceptance Criteria

1. WHEN a ghost types a message and clicks "Send Persistent Message" THEN the GhostNet System SHALL broadcast the message to all connected peers via WebRTC data channels
2. WHEN a persistent message is sent or received THEN the GhostNet System SHALL display the message with sender name, text, and timestamp
3. WHEN a persistent message is displayed THEN the GhostNet System SHALL keep the message visible in the chat history indefinitely during the session

### Requirement 7: Screen Shake Effect

**User Story:** As a ghost, I want to trigger a screen shake effect on other ghosts' screens, so that I can spook them with a visual surprise.

#### Acceptance Criteria

1. WHEN a ghost clicks the "Shake Screen" button THEN the GhostNet System SHALL broadcast a shake control signal to all connected peers
2. WHEN a ghost receives a shake control signal THEN the GhostNet System SHALL apply a CSS shake animation to the main chat panel for 500 milliseconds

### Requirement 8: Ghost Whisper Sound Effect

**User Story:** As a ghost, I want to trigger a spooky whisper sound on other ghosts' devices, so that I can create an immersive haunted experience.

#### Acceptance Criteria

1. WHEN a ghost clicks the "Ghost Whisper" button THEN the GhostNet System SHALL broadcast a whisper control signal to all connected peers
2. WHEN a ghost receives a whisper control signal THEN the GhostNet System SHALL play a short spooky audio sound effect

### Requirement 9: Halloween-Themed UI

**User Story:** As a user, I want the application to have a spooky Halloween theme, so that the chat experience feels fun and on-theme for a hackathon demo.

#### Acceptance Criteria

1. WHEN the application loads THEN the GhostNet System SHALL display a dark mode interface with Halloween colors including purple, dark gray, and neon green highlights
2. WHEN displaying the header THEN the GhostNet System SHALL show the app title "GhostNet" with ghost-themed styling and the current user's ghost name
3. WHEN displaying messages THEN the GhostNet System SHALL use ghostly visual effects including glows and semi-transparent styling

### Requirement 10: Connection State Management

**User Story:** As a ghost, I want to see clear feedback about my connection status, so that I know when I can send and receive messages.

#### Acceptance Criteria

1. WHILE connecting to the signaling server THEN the GhostNet System SHALL display a loading indicator
2. WHEN a peer connection is lost THEN the GhostNet System SHALL update the ghost list to reflect the disconnection
3. IF all peer connections are lost THEN the GhostNet System SHALL display a notification indicating connection issues

### Requirement 11: Message Serialization

**User Story:** As a developer, I want messages to be serialized to JSON for transmission, so that message data can be reliably sent and received over WebRTC data channels.

#### Acceptance Criteria

1. WHEN sending a message over a WebRTC data channel THEN the GhostNet System SHALL serialize the message object to JSON format
2. WHEN receiving a message from a WebRTC data channel THEN the GhostNet System SHALL deserialize the JSON string back to a message object
3. WHEN serializing a message THEN the GhostNet System SHALL include message type, sender, content, and timestamp fields


### Requirement 12: Message Type Routing

**User Story:** As a developer, I want all WebRTC messages to include a message type, so the system can correctly route messages, effects, and control signals.

#### Acceptance Criteria

1. WHEN sending any data over WebRTC THEN the GhostNet System SHALL include a `type` field in the JSON payload (e.g., "ghost_message", "persistent_message", "shake", "whisper")
2. WHEN receiving a payload THEN the GhostNet System SHALL route handling based on the `type` value
3. IF the GhostNet System receives an unknown `type` THEN the GhostNet System SHALL safely ignore the message and optionally log it

### Requirement 13: User Control for Sound and Effects

**User Story:** As a ghost, I want options to mute sounds and disable shake effects, so that I can control the intensity of the spooky experience.

#### Acceptance Criteria

1. WHEN the chat screen loads THEN the GhostNet System SHALL display a simple settings panel with toggles for sound and screen shake
2. IF sound is muted THEN the GhostNet System SHALL not play whisper audio but SHALL still process messages
3. IF screen shake is disabled THEN the GhostNet System SHALL not apply shake animations on receiving shake signals

### Requirement 14: WebRTC Capability Detection and Error Handling

**User Story:** As a user, I want clear feedback if my browser does not support WebRTC or if connections fail, so that I understand why messaging is not working.

#### Acceptance Criteria

1. WHEN the application loads THEN the GhostNet System SHALL detect basic WebRTC support and display an error message if WebRTC is unsupported
2. IF a peer connection fails THEN the GhostNet System SHALL display a warning notification (e.g., "Some ghosts could not be reached")
3. IF the signaling server cannot be reached THEN the GhostNet System SHALL display a visible error banner and disable message sending

### Requirement 15: Performance and Limits

**User Story:** As a hackathon team, we want GhostNet to remain stable with small groups and handle basic performance constraints.

#### Acceptance Criteria

1. WHILE up to 8 ghosts are connected THEN the GhostNet System SHALL maintain responsive performance with message rendering within 200 milliseconds
2. IF more than 8 ghosts join THEN the GhostNet System SHALL display a notice about possible performance degradation
3. WHEN handling signaling events THEN the Signaling Server SHALL only process join, leave, offer, answer, and ICE events and SHALL NOT relay chat messages

### Requirement 16: Responsive UI Layout

**User Story:** As a user, I want the interface to remain usable on both large and small screens.

#### Acceptance Criteria

1. WHEN the application is opened on a mobile device THEN the GhostNet System SHALL collapse or hide the sidebar and optimize the layout for narrow screens
2. WHEN the application is opened on a laptop or desktop THEN the GhostNet System SHALL display the full layout including sidebar, chat area, and header without overlap

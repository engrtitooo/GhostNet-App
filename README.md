<p align="center">
  <img src="frontend/public/ghost.svg" alt="GhostNet Logo" width="140" height="140">
</p>

<h1 align="center">👻 GhostNet</h1>

<p align="center">
  <strong>Ephemeral peer-to-peer messaging for the haunted web</strong>
</p>

<p align="center">
  <em>A real-time WebRTC chat application where messages fade like ghosts,<br>
  screens shake with supernatural force, and whispers echo through the void.</em>
</p>

<p align="center">
  <a href="https://ghostnet.app">🌐 Live Demo</a> •
  <a href="#-built-with-kiro-ai">Built with Kiro</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-why-ghostnet-is-unique">Why It's Unique</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-Kiro%20Halloween%202024-purple?style=for-the-badge" alt="Kiro Halloween Hackathon">
  <img src="https://img.shields.io/badge/WebRTC-P2P%20Mesh-green?style=for-the-badge" alt="WebRTC P2P">
  <img src="https://img.shields.io/badge/Built%20With-Kiro%20AI-orange?style=for-the-badge" alt="Built with Kiro">
</p>

---

## 🎃 Introduction

**GhostNet** is a Halloween-themed, real-time chat application that demonstrates the power of pure WebRTC mesh networking. Built for the [Kiro Halloween Hackathon](https://kiroween.devpost.com/), it showcases how AI-assisted development can produce production-ready, architecturally sound applications.

### The Haunted Experience

- **Ghost Messages** — Ephemeral messages that materialize and fade away after 5 seconds
- **Persistent Messages** — Leave your mark in the chat history
- **Screen Shake** — Rattle every connected user's display with supernatural force
- **Whisper Sounds** — Synthesized ghostly audio that echoes across all peers
- **Zero Friction** — No accounts, no passwords, just pick a ghost name and haunt

### The Engineering Reality

Beneath the spooky surface lies serious WebRTC engineering:
- True peer-to-peer mesh network (no message relay servers)
- WebSocket signaling for connection establishment only
- Shared TypeScript types across frontend and backend
- Production deployment on Netlify + Render

---

## 🌐 Live Demo

<p align="center">
  <a href="https://ghostnet.app">
    <img src="https://img.shields.io/badge/🚪%20Enter%20the%20Haunted%20Lobby-ghostnet.app-purple?style=for-the-badge&labelColor=1a1a2e" alt="Live Demo">
  </a>
</p>

**[https://ghostnet.app](https://ghostnet.app)**

Open in multiple browser tabs or share with friends to experience the full P2P magic. No sign-up required.

---

## 🤖 Built With Kiro AI

GhostNet was developed with **Kiro** as a full engineering partner—not just a code assistant, but a collaborator that shaped architecture, debugged complex systems, and refined the user experience.

### Kiro's Role in Development

| Development Phase | How Kiro Contributed |
|-------------------|----------------------|
| **📋 Spec Generation** | Created structured requirements documents with acceptance criteria, breaking down the entire project into implementable tasks |
| **🏗️ Architecture Planning** | Designed the signaling server, WebRTC peer manager, and React component hierarchy with repo-wide awareness |
| **🔧 Signaling System Debug** | Diagnosed WebSocket reconnection issues, intentional disconnect handling, and error state management |
| **🧠 Repo-Wide Reasoning** | Maintained consistency across frontend, backend, and shared types—understanding how changes in one file affect others |
| **🎨 Vibe Coding for UI** | Refined the Halloween aesthetic through iterative prompts—animations, color schemes, responsive layouts |
| **📡 WebRTC State Management** | Implemented the peer connection lifecycle, ICE candidate exchange, and data channel message handling |
| **⚡ Development Velocity** | Accelerated implementation from concept to production deployment in a fraction of typical development time |

### What Makes This a Kiro Showcase

1. **Complex Distributed System** — WebRTC mesh networking requires coordinating signaling, ICE negotiation, and peer state across multiple browsers. Kiro handled this complexity with architectural clarity.

2. **Full-Stack Type Safety** — Shared TypeScript definitions between frontend and backend, with Kiro ensuring protocol consistency across the codebase.

3. **Production-Ready Code** — Not a prototype. Deployed, tested, and handling edge cases like browser autoplay policies, reconnection logic, and graceful disconnection.

4. **Iterative Refinement** — From initial scaffolding to final polish, Kiro adapted to feedback and improved the implementation across dozens of iterations.

---

## 🛠️ How Kiro Helped Build GhostNet

### Phase 1: Requirements Creation

Kiro generated comprehensive requirements using **Kiro Specs**, producing structured documents that defined:
- User stories for ghost name entry and lobby joining
- Acceptance criteria for message types (ghost vs. persistent)
- Technical requirements for WebRTC peer connections
- Edge cases for disconnection and reconnection

```
.kiro/specs/ghostnet/
├── requirements.md    # Functional requirements & acceptance criteria
├── design.md          # Technical architecture & component design
└── tasks.md           # Implementation checklist
```

### Phase 2: Architecture Design

Kiro designed a clean separation of concerns:
- **Signaling Server** — Minimal WebSocket server for peer discovery and SDP exchange
- **Peer Manager** — Client-side WebRTC connection management
- **Message Protocol** — Typed message formats shared between all components
- **React Hooks** — `useGhostNet` encapsulating all P2P logic

### Phase 3: Iterative Implementation

Development proceeded through continuous dialogue with Kiro:
- Initial scaffolding of frontend and backend
- WebRTC data channel implementation
- Signaling protocol refinement
- Error handling and reconnection logic
- Feature additions (shake, whisper, persistent messages)

### Phase 4: Testing & Property-Based Reasoning

Kiro guided test design with property-based thinking:
- Message validation edge cases
- Ghost name constraints
- Signaling protocol correctness
- WebRTC state transitions

### Phase 5: UI Refinement with Vibe Coding

The Halloween aesthetic emerged through **Vibe Coding**—iterative prompts that refined:
- Color palette (ghost purple, neon green, dark backgrounds)
- CSS animations (floating ghost, message fade, screen shake)
- Responsive layout adjustments
- Audio synthesis for whisper effects

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GhostNet System Architecture                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    ┌─────────────────┐                         ┌─────────────────┐      │
│    │   Browser A     │                         │   Browser B     │      │
│    │  ┌───────────┐  │                         │  ┌───────────┐  │      │
│    │  │  React    │  │                         │  │  React    │  │      │
│    │  │  Frontend │  │                         │  │  Frontend │  │      │
│    │  └─────┬─────┘  │                         │  └─────┬─────┘  │      │
│    │        │        │                         │        │        │      │
│    │  ┌─────┴─────┐  │    WebRTC DataChannel   │  ┌─────┴─────┐  │      │
│    │  │  Peer     │◄─┼─────────────────────────┼─►│  Peer     │  │      │
│    │  │  Manager  │  │   (Direct P2P - No      │  │  Manager  │  │      │
│    │  └─────┬─────┘  │    Server Involved)     │  └─────┬─────┘  │      │
│    │        │        │                         │        │        │      │
│    └────────┼────────┘                         └────────┼────────┘      │
│             │                                           │               │
│             │ WebSocket                       WebSocket │               │
│             │ (Signaling Only)           (Signaling Only)               │
│             │                                           │               │
│             └──────────────┐       ┌────────────────────┘               │
│                            │       │                                    │
│                            ▼       ▼                                    │
│                     ┌──────────────────┐                                │
│                     │  Signaling Server │                               │
│                     │  (Render.com)     │                               │
│                     │                   │                               │
│                     │  • Lobby Manager  │                               │
│                     │  • SDP Relay      │                               │
│                     │  • ICE Relay      │                               │
│                     └──────────────────┘                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
ghostnet/
├── frontend/                    # React + TypeScript + Vite + Tailwind
│   ├── src/
│   │   ├── components/          # UI Components
│   │   │   ├── WelcomeScreen.tsx    # Ghost name entry
│   │   │   ├── ChatArea.tsx         # Message display + shake animation
│   │   │   ├── MessageInput.tsx     # Input + action buttons
│   │   │   ├── GhostMessage.tsx     # Ephemeral message component
│   │   │   ├── PersistentMessage.tsx# Permanent message component
│   │   │   ├── Header.tsx           # Settings + leave button
│   │   │   └── Sidebar.tsx          # Connected ghosts list
│   │   ├── hooks/
│   │   │   └── useGhostNet.ts       # Main P2P logic hook
│   │   ├── lib/
│   │   │   ├── webrtc.ts            # PeerManager class
│   │   │   ├── signaling.ts         # SignalingClient class
│   │   │   ├── messages.ts          # Message creation utilities
│   │   │   ├── audio.ts             # Web Audio API whisper sound
│   │   │   ├── validation.ts        # Ghost name validation
│   │   │   └── types.ts             # Frontend type definitions
│   │   └── App.tsx
│   └── package.json
│
├── backend/                     # Express + ws WebSocket Server
│   ├── src/
│   │   ├── server.ts                # HTTP + WebSocket server
│   │   ├── signaling.ts             # Signaling message handlers
│   │   ├── lobby.ts                 # Ghost name registry
│   │   └── types.ts                 # Backend type definitions
│   └── package.json
│
├── shared/                      # Shared TypeScript Types
│   └── types.ts                     # Protocol definitions
│
└── README.md
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, TypeScript, Vite | UI framework and build tooling |
| **Styling** | Tailwind CSS | Halloween-themed responsive design |
| **Real-Time** | WebRTC DataChannels | Direct P2P message delivery |
| **Signaling** | WebSocket (ws) | Peer discovery and SDP exchange |
| **Backend** | Node.js, Express | Signaling server runtime |
| **Audio** | Web Audio API | Synthesized whisper sounds |
| **Deployment** | Netlify, Render | Production hosting |

---

## 🔄 How It Works

### Connection Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     GhostNet Connection Flow                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User enters ghost name                                        │
│           │                                                       │
│           ▼                                                       │
│  2. Frontend connects to signaling server (WebSocket)             │
│           │                                                       │
│           ▼                                                       │
│  3. Server validates name, adds to lobby                          │
│           │                                                       │
│           ▼                                                       │
│  4. Server broadcasts updated ghost list to all peers             │
│           │                                                       │
│           ▼                                                       │
│  5. New ghost creates WebRTC offers for each existing ghost       │
│           │                                                       │
│           ▼                                                       │
│  6. Offers/Answers exchanged via signaling server                 │
│           │                                                       │
│           ▼                                                       │
│  7. ICE candidates exchanged for NAT traversal                    │
│           │                                                       │
│           ▼                                                       │
│  8. Direct P2P DataChannels established                           │
│           │                                                       │
│           ▼                                                       │
│  9. All messages now flow directly between browsers               │
│      (Signaling server no longer involved in messaging)           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Message Protocol

| Message Type | Transport | Behavior |
|--------------|-----------|----------|
| `ghost_message` | WebRTC P2P | Appears, then fades after 5 seconds |
| `persistent_message` | WebRTC P2P | Remains in chat history |
| `shake` | WebRTC P2P | Triggers CSS shake animation on all peers |
| `whisper` | WebRTC P2P | Plays synthesized audio on all peers |

---

## 📸 Screenshots

<p align="center">
  <strong>Welcome Screen</strong><br>
  <em>Enter your ghost name to join the haunted lobby</em><br><br>
  <img src="docs/screenshots/welcome-screen.png" alt="Welcome Screen" width="700">
</p>

<p align="center">
  <strong>Chat Interface</strong><br>
  <em>Send ghost messages, persistent messages, shake screens, or whisper</em><br><br>
  <img src="docs/screenshots/chat-interface.png" alt="Chat Interface" width="700">
</p>

<p align="center">
  <strong>Ghost Message Fading</strong><br>
  <em>Ephemeral messages that disappear like spirits</em><br><br>
  <img src="docs/screenshots/ghost-fade.gif" alt="Ghost Message Fading" width="700">
</p>

<p align="center">
  <strong>Kiro Specs</strong><br>
  <em>Requirements and design documents generated with Kiro</em><br><br>
  <img src="docs/screenshots/kiro-specs.png" alt="Kiro Specs" width="700">
</p>

<p align="center">
  <strong>Vibe Coding Session</strong><br>
  <em>Iterative UI refinement with Kiro</em><br><br>
  <img src="docs/screenshots/vibe-coding.png" alt="Vibe Coding" width="700">
</p>

---

## 🎯 Why GhostNet Is Unique

### 🕸️ Pure WebRTC Mesh Network

Unlike typical chat applications that relay messages through servers, GhostNet establishes **direct browser-to-browser connections**. After the initial WebRTC handshake, the signaling server is only used for new peer discovery. All messages, shake effects, and whisper sounds travel directly between browsers with zero server involvement.

### 🚫 No Database, No Authentication

- **Zero persistence** — Messages exist only in browser memory
- **No user accounts** — Anonymous ghost names validated client-side
- **No cookies or tracking** — When you leave, you're gone
- **Privacy by architecture** — The server literally cannot store your messages

### 👻 Ephemeral Ghost Messages

The signature feature: messages that materialize and fade away after 5 seconds. Like whispers in a haunted house, they're there and then they're not. Perfect for the Halloween theme and a genuine technical differentiator.

### 📳 Interactive Spooky Effects

- **Screen Shake** — CSS animation triggered across all connected peers via WebRTC
- **Whisper Sound** — Web Audio API synthesized ghostly audio (no audio files needed)
- **User Controls** — Toggle effects on/off for accessibility

### 🎃 Halloween Aesthetic

The theme isn't just a skin—it's integrated into the UX:
- Dark purple/green color palette with glow effects
- Floating ghost animations
- Spooky placeholder text and messaging
- Responsive design that maintains atmosphere on mobile

### ⚡ Zero Friction User Flow

1. Open the app
2. Enter a ghost name
3. Start chatting

No sign-up forms. No email verification. No password requirements. Just instant haunting.

---

## 💻 Local Development

### Prerequisites

- Node.js 18+
- npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/AhmedAlmaghz/ghostnet.git
cd ghostnet

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and automatically connects to the backend at `ws://localhost:3001/ws`.

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 🚀 Deployment

### Frontend — Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. Add environment variable:
   ```
   VITE_WS_URL = wss://ghostnet-app.onrender.com/ws
   ```
4. Deploy

### Backend — Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure settings:
   - **Root directory:** `backend`
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
4. Deploy

### Environment Variables

| Variable | Service | Value |
|----------|---------|-------|
| `VITE_WS_URL` | Netlify (Frontend) | `wss://ghostnet-app.onrender.com/ws` |
| `PORT` | Render (Backend) | Auto-configured |

---

## 🙏 Acknowledgments

### Kiro — The Engineering Partner

This project would not exist in its current form without **Kiro**. From generating the initial requirements to debugging WebRTC edge cases to polishing the Halloween UI, Kiro functioned as a full engineering team:

- **Architect** — Designed the signaling protocol and peer management system
- **Backend Engineer** — Implemented the WebSocket server and lobby management
- **Frontend Engineer** — Built React components and the `useGhostNet` hook
- **DevOps** — Guided deployment configuration for Netlify and Render
- **QA Engineer** — Identified edge cases and helped write tests
- **UI/UX Designer** — Refined the Halloween aesthetic through Vibe Coding

Kiro didn't just write code—it understood the project holistically and made architectural decisions that a human engineer would make.

---

## 📄 License

MIT License — Feel free to fork, modify, and haunt your own version.

---

<p align="center">
  <strong>Built with 👻 and <a href="https://kiro.dev">Kiro AI</a></strong><br>
  for the <a href="https://kiroween.devpost.com/">Kiro Halloween Hackathon 2024</a>
</p>

<p align="center">
  <a href="https://ghostnet.app">Enter the Haunted Lobby →</a>
</p>

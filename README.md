<p align="center">
  <img src="frontend/public/ghost.svg" alt="GhostNet Logo" width="120" height="120">
</p>

<h1 align="center">👻 GhostNet</h1>

<p align="center">
  <strong>Ephemeral P2P messaging for the haunted web</strong>
</p>

<p align="center">
  A real-time, peer-to-peer chat application built with WebRTC mesh networking.<br>
  No servers storing your messages. No databases. No accounts. Just ghosts talking to ghosts.
</p>

<p align="center">
  <a href="https://ghostnet.app">🌐 Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#built-with-kiro-ai">Built with Kiro</a>
</p>

---

## 🎃 Live Demo

**[https://ghostnet.app](https://ghostnet.app)**

Open in multiple browser tabs or devices to experience the full P2P magic. No sign-up required—just pick a ghost name and start haunting.

---

## 📖 Overview

GhostNet is a Halloween-themed, real-time chat application that demonstrates pure WebRTC mesh networking. Messages travel directly between browsers with zero server involvement after the initial handshake.

The project was built for the [Kiro Halloween Hackathon](https://kiroween.devpost.com/) to showcase how Kiro AI can accelerate the development of complex, production-ready applications.

### The Concept

Imagine a haunted chatroom where:
- **Ghost Messages** appear and fade away after 5 seconds—like whispers in the dark
- **Persistent Messages** stay visible for those who want to leave a lasting mark
- **Screen Shake** lets you rattle everyone's display with a single click
- **Whisper Sounds** play spooky audio effects across all connected peers
- Everything happens peer-to-peer, with no central server storing your conversations

---

## 🤖 Built with Kiro AI

This project was developed entirely with **Kiro** as an AI engineering partner. Kiro wasn't just a code assistant—it functioned as a full-stack collaborator across every phase of development.

### How Kiro Accelerated Development

| Phase | Kiro's Contribution |
|-------|---------------------|
| **Requirements & Specs** | Generated structured requirements documents using Kiro Specs, breaking down the project into clear acceptance criteria and implementation tasks |
| **Architecture Design** | Provided multi-file, repo-aware reasoning to design the signaling server, WebRTC peer manager, and React component hierarchy |
| **Implementation** | Wrote production-quality TypeScript across frontend and backend, maintaining consistency with shared type definitions |
| **Vibe Coding** | Polished the Halloween UI with Tailwind CSS—animations, color schemes, and responsive layouts refined through iterative prompts |
| **Debugging** | Diagnosed WebRTC connection issues, WebSocket reconnection logic, and browser autoplay policies for audio |
| **Testing** | Guided property-based test design for message validation and signaling protocols |
| **Refactoring** | Improved code organization, extracted reusable hooks, and optimized component re-renders |

### Why This Project Demonstrates Kiro's Capabilities

1. **Complex Real-Time System**: WebRTC mesh networking requires careful coordination between signaling, ICE candidates, and data channels. Kiro handled this complexity with precision.

2. **Full-Stack Coherence**: Shared TypeScript types between frontend and backend, consistent error handling, and unified message protocols—all maintained by Kiro across the codebase.

3. **Production-Ready Output**: The code isn't a prototype. It's deployed, tested, and handles edge cases like reconnection, browser compatibility, and graceful disconnection.

4. **Iterative Refinement**: From initial scaffolding to final polish, Kiro adapted to feedback and improved the implementation across multiple iterations.

---

## ✨ Features

### Core Messaging
- **Ghost Messages**: Ephemeral messages that auto-delete after 5 seconds
- **Persistent Messages**: Standard messages that remain in the chat history
- **Real-Time Delivery**: Sub-second message delivery via WebRTC data channels

### Spooky Effects
- **Screen Shake**: Trigger a CSS shake animation on all connected peers
- **Whisper Sound**: Play a synthesized ghostly audio effect using Web Audio API
- **Toggle Controls**: Users can disable shake/sound effects if desired

### Technical Features
- **Pure P2P Mesh**: After signaling, all communication is direct browser-to-browser
- **No Authentication**: Anonymous ghost names with client-side validation
- **No Database**: Zero message persistence—when you leave, your messages vanish
- **Responsive Design**: Works on desktop and mobile browsers
- **Reconnection Handling**: Automatic reconnection attempts if the signaling server disconnects

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GhostNet Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         WebSocket          ┌──────────────┐   │
│  │   Browser A  │◄─────────────────────────►│   Signaling   │   │
│  │  (React App) │                            │    Server     │   │
│  └──────┬───────┘                            │  (Express+ws) │   │
│         │                                    └───────┬───────┘   │
│         │ WebRTC Data Channel                        │           │
│         │ (P2P - No Server)                          │           │
│         ▼                                            ▼           │
│  ┌──────────────┐         WebSocket          ┌──────────────┐   │
│  │   Browser B  │◄─────────────────────────►│   Signaling   │   │
│  │  (React App) │                            │    Server     │   │
│  └──────────────┘                            └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
ghostnet/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # UI components (ChatArea, MessageInput, etc.)
│   │   ├── hooks/            # useGhostNet - main application logic
│   │   ├── lib/              # WebRTC, signaling, audio, validation
│   │   └── App.tsx           # Root component
│   └── package.json
│
├── backend/                  # Express + ws WebSocket server
│   ├── src/
│   │   ├── server.ts         # HTTP + WebSocket server
│   │   ├── signaling.ts      # WebRTC signaling logic
│   │   ├── lobby.ts          # Ghost name management
│   │   └── types.ts          # Server-side types
│   └── package.json
│
├── shared/                   # Shared TypeScript types
│   └── types.ts              # Message protocols, signaling types
│
└── README.md
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, ws (WebSocket) |
| Real-Time | WebRTC (RTCPeerConnection, RTCDataChannel) |
| Audio | Web Audio API (synthesized sounds) |
| Deployment | Netlify (frontend), Render (backend) |

---

## 🔄 How It Works

### Connection Flow

```
1. User enters ghost name
         │
         ▼
2. Frontend connects to signaling server (WebSocket)
         │
         ▼
3. Server broadcasts ghost list to all peers
         │
         ▼
4. New ghost initiates WebRTC offers to existing ghosts
         │
         ▼
5. ICE candidates exchanged via signaling server
         │
         ▼
6. Direct P2P data channels established
         │
         ▼
7. All messages now flow directly between browsers
```

### Message Types

| Type | Protocol | Behavior |
|------|----------|----------|
| `ghost_message` | WebRTC | Displayed for 5 seconds, then removed |
| `persistent_message` | WebRTC | Stays in chat history |
| `shake` | WebRTC | Triggers CSS animation on all peers |
| `whisper` | WebRTC | Plays audio effect on all peers |

### Signaling Protocol

The signaling server handles:
- `join` - Register a ghost name
- `ghost_list` - Broadcast current lobby members
- `offer` / `answer` - WebRTC SDP exchange
- `ice_candidate` - ICE candidate relay
- `ghost_left` - Notify peers of disconnection

---

## 📸 Screenshots

<p align="center">
  <em>Welcome Screen</em><br>
  <img src="docs/screenshots/welcome.png" alt="Welcome Screen" width="600">
</p>

<p align="center">
  <em>Chat Interface</em><br>
  <img src="docs/screenshots/chat.png" alt="Chat Interface" width="600">
</p>

<p align="center">
  <em>Ghost Message Fading</em><br>
  <img src="docs/screenshots/ghost-message.gif" alt="Ghost Message" width="600">
</p>

---

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ghostnet.git
cd ghostnet

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start the backend (terminal 1)
cd backend
npm run dev

# Start the frontend (terminal 2)
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and connects to the backend at `ws://localhost:3001/ws`.

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 🚀 Deployment

### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. Add environment variable:
   ```
   VITE_WS_URL = wss://ghostnet-app.onrender.com/ws
   ```

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build settings:
   - **Root directory**: `backend`
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm start`
4. The WebSocket endpoint will be available at `wss://your-service.onrender.com/ws`

### Environment Variables

| Variable | Location | Value |
|----------|----------|-------|
| `VITE_WS_URL` | Netlify (frontend) | `wss://ghostnet-app.onrender.com/ws` |
| `PORT` | Render (backend) | Auto-configured by Render |

---

## 🎯 Why GhostNet Is Unique

### Pure WebRTC Engineering

Unlike chat apps that relay messages through servers, GhostNet establishes a true mesh network. After the initial WebRTC handshake, the signaling server is only used for new peer discovery. All messages, shake effects, and whisper sounds travel directly between browsers.

### Zero Persistence by Design

- No database
- No message history on the server
- No user accounts
- No cookies or tracking

When you close the tab, you're gone. When everyone leaves, the conversation never existed.

### Halloween-Themed UX

The spooky theme isn't just cosmetic:
- Ghost messages that fade like spirits
- Screen shake to "haunt" other users
- Synthesized whisper sounds using Web Audio API
- Dark purple/green color palette with glow effects
- Floating ghost animations

### Production-Ready Architecture

Despite being a hackathon project, GhostNet is built with production patterns:
- TypeScript end-to-end with shared types
- Proper error handling and reconnection logic
- Responsive design for mobile and desktop
- Clean separation of concerns (hooks, components, lib)

---

## 📄 License

MIT License - feel free to haunt this code.

---

<p align="center">
  Built with 👻 and <a href="https://kiro.dev">Kiro AI</a> for the <a href="https://kiroween.devpost.com/">Kiro Halloween Hackathon</a>
</p>

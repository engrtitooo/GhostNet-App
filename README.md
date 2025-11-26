# 👻 GhostNet - Local Peer-to-Peer Ghost Chat

A spooky, Halloween-themed peer-to-peer chat application that lets users on the same local network send ghostly messages without a centralized server.

## ✨ Features

- **Ghost Messages** - Ephemeral messages that fade away after 5 seconds
- **Persistent Messages** - Standard chat messages that stay in history
- **Screen Shake** - Spook other users by shaking their screens
- **Ghost Whisper** - Play eerie sound effects on other users' devices
- **WebRTC P2P** - Direct peer-to-peer messaging (no server relay)
- **Halloween Theme** - Dark mode with purple, neon green accents
- **Responsive UI** - Works on desktop and mobile

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- WebRTC Data Channels (P2P messaging)
- Web Audio API (sound effects)

**Backend (Signaling Server):**
- Node.js + TypeScript
- Express
- WebSocket (`ws` library)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ghostnet.git
cd ghostnet
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### Running Locally

1. Start the signaling server:
```bash
cd backend
npm run dev
```
The server runs on `http://localhost:3001`

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
The app runs on `http://localhost:5173`

### Demo (Two Browser Windows)

1. Open `http://localhost:5173` in two browser windows
2. Enter different ghost names in each window
3. Both ghosts should appear in each other's sidebar
4. Send messages, trigger shakes, and play whisper sounds!

## 📁 Project Structure

```
ghostnet/
├── frontend/
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and modules
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── server.ts       # Express + WebSocket server
│   │   ├── signaling.ts    # WebRTC signaling handler
│   │   ├── lobby.ts        # Ghost lobby manager
│   │   └── types.ts        # TypeScript types
│   └── package.json
├── shared/                 # Shared type definitions
└── README.md
```

## 🎮 How It Works

1. **Join**: User enters a ghost name and connects to the signaling server
2. **Discovery**: Server broadcasts new ghost to existing users
3. **WebRTC Setup**: Peers exchange offers/answers via signaling server
4. **P2P Messaging**: Once connected, messages flow directly between peers
5. **Effects**: Shake and whisper signals trigger visual/audio effects

## ⚠️ Known Limitations

- **Single Room**: All users join the same "lobby" (no private rooms)
- **No Authentication**: Anyone can join with any name
- **Local Network**: Best suited for users on the same network
- **Mesh Topology**: Performance may degrade with 8+ users
- **No Persistence**: Messages are lost on page refresh

## 🧪 Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📝 License

MIT License - feel free to use for your own spooky projects!

---

Built with 👻 for hackathon fun!

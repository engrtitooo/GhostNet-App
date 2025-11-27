import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { LobbyManager } from './lobby.js'
import { SignalingHandler } from './signaling.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:5173',              // Local development (Vite)
  'http://localhost:3000',              // Alternative local
  'https://ghostnet.app',               // Production custom domain
  'https://www.ghostnet.app',           // Production with www
  'https://ghostnet-app.netlify.app',   // Netlify deployment
  /\.netlify\.app$/,                    // Netlify preview deploys
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    )
    
    if (isAllowed) {
      callback(null, true)
    } else {
      console.log(`CORS blocked origin: ${origin}`)
      callback(null, true) // Allow anyway for hackathon demo
    }
  },
  credentials: true
}))
app.use(express.json())

// Create lobby and signaling handler
const lobby = new LobbyManager()
const signalingHandler = new SignalingHandler(lobby)

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connectedGhosts: lobby.size
  })
})

// Get connected ghosts (for debugging)
app.get('/ghosts', (_req, res) => {
  res.json({
    ghosts: lobby.getGhosts(),
    count: lobby.size
  })
})

// Create HTTP server
const server = createServer(app)

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' })

wss.on('connection', (ws) => {
  signalingHandler.handleConnection(ws)
})

// Start server
server.listen(PORT, () => {
  console.log(`🔮 GhostNet signaling server running on port ${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   WebSocket: ws://localhost:${PORT}/ws`)
})

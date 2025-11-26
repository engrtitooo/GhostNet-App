import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { LobbyManager } from './lobby.js'
import { SignalingHandler } from './signaling.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
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

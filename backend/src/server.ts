import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Create HTTP server
const server = createServer(app)

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' })

wss.on('connection', (ws) => {
  console.log('New WebSocket connection')
  
  ws.on('message', (data) => {
    console.log('Received:', data.toString())
  })
  
  ws.on('close', () => {
    console.log('WebSocket connection closed')
  })
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`🔮 GhostNet signaling server running on port ${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   WebSocket: ws://localhost:${PORT}/ws`)
})

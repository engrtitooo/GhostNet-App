import { WebSocket } from 'ws'
import type { SignalingMessage, GhostListMessage, GhostJoinedMessage, GhostLeftMessage } from './types.js'

interface GhostConnection {
  ghostName: string
  ws: WebSocket
}

/**
 * LobbyManager handles tracking connected ghosts and message broadcasting.
 * All ghosts join a single "lobby" room.
 */
export class LobbyManager {
  private ghosts: Map<string, GhostConnection> = new Map()

  /**
   * Add a ghost to the lobby
   * @returns true if added successfully, false if name already taken
   */
  addGhost(ghostName: string, ws: WebSocket): boolean {
    if (this.ghosts.has(ghostName)) {
      return false
    }
    this.ghosts.set(ghostName, { ghostName, ws })
    console.log(`👻 Ghost joined: ${ghostName} (${this.ghosts.size} total)`)
    return true
  }

  /**
   * Remove a ghost from the lobby
   */
  removeGhost(ghostName: string): void {
    if (this.ghosts.delete(ghostName)) {
      console.log(`👻 Ghost left: ${ghostName} (${this.ghosts.size} remaining)`)
    }
  }

  /**
   * Remove a ghost by their WebSocket connection
   */
  removeGhostByWs(ws: WebSocket): string | null {
    for (const [name, conn] of this.ghosts.entries()) {
      if (conn.ws === ws) {
        this.ghosts.delete(name)
        console.log(`👻 Ghost disconnected: ${name} (${this.ghosts.size} remaining)`)
        return name
      }
    }
    return null
  }

  /**
   * Get list of all ghost names in the lobby
   */
  getGhosts(): string[] {
    return Array.from(this.ghosts.keys())
  }

  /**
   * Get the WebSocket for a specific ghost
   */
  getGhostWs(ghostName: string): WebSocket | undefined {
    return this.ghosts.get(ghostName)?.ws
  }

  /**
   * Check if a ghost name is already taken
   */
  hasGhost(ghostName: string): boolean {
    return this.ghosts.has(ghostName)
  }

  /**
   * Broadcast a message to all ghosts except the excluded one
   */
  broadcast(message: SignalingMessage, excludeGhost?: string): void {
    const data = JSON.stringify(message)
    for (const [name, conn] of this.ghosts.entries()) {
      if (name !== excludeGhost && conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(data)
      }
    }
  }

  /**
   * Send a message to a specific ghost
   */
  sendTo(ghostName: string, message: SignalingMessage): boolean {
    const conn = this.ghosts.get(ghostName)
    if (conn && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.send(JSON.stringify(message))
      return true
    }
    return false
  }

  /**
   * Send the current ghost list to a specific ghost
   */
  sendGhostList(ghostName: string): void {
    const message: GhostListMessage = {
      type: 'ghost_list',
      payload: { ghosts: this.getGhosts().filter(g => g !== ghostName) }
    }
    this.sendTo(ghostName, message)
  }

  /**
   * Broadcast that a new ghost has joined
   */
  broadcastGhostJoined(ghostName: string): void {
    const message: GhostJoinedMessage = {
      type: 'ghost_joined',
      payload: { ghostName }
    }
    this.broadcast(message, ghostName)
  }

  /**
   * Broadcast that a ghost has left
   */
  broadcastGhostLeft(ghostName: string): void {
    const message: GhostLeftMessage = {
      type: 'ghost_left',
      payload: { ghostName }
    }
    this.broadcast(message)
  }

  /**
   * Get the number of connected ghosts
   */
  get size(): number {
    return this.ghosts.size
  }
}

export interface Point {
  x: number
  y: number
}

export interface DrawingPath {
  id: string
  points: Point[]
  color: string
  tool: "pencil" | "eraser"
  width: number
}

export interface Room {
  id: string
  name: string
  participants: number
  createdAt: Date
}

export interface WhiteboardState {
  paths: DrawingPath[]
  currentTool: "pencil" | "eraser"
  currentColor: string
  brushSize: number
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
  type: "text" | "system"
}

export interface User {
  id: string
  username: string
  color: string
  isOnline: boolean
  isMuted: boolean
  isVideoOn: boolean
}

export interface AudioState {
  isMuted: boolean
  isDeafened: boolean
  volume: number
}

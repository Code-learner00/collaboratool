"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import type { DrawingPath, Point, WhiteboardState, ChatMessage, User, AudioState } from "../types/whiteboard"
import { getMousePos, getTouchPos, drawPath, redrawCanvas } from "../utils/drawing"
import Toolbar from "./toolbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, MessageCircle } from "lucide-react"
import ChatPanel from "./chat-panel"
import AudioControls from "./audio-controls"

interface WhiteboardProps {
  roomId: string
  onLeaveRoom: () => void
}

export default function Whiteboard({ roomId, onLeaveRoom }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null)
  const [state, setState] = useState<WhiteboardState>({
    paths: [],
    currentTool: "pencil",
    currentColor: "#000000",
    brushSize: 3,
  })

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userId: "system",
      username: "System",
      message: "Welcome to the whiteboard! Start collaborating.",
      timestamp: new Date(),
      type: "system",
    },
  ])
  const [users] = useState<User[]>([
    { id: "user-1", username: "You", color: "#3B82F6", isOnline: true, isMuted: false, isVideoOn: false },
    
  ])
  const [audioState, setAudioState] = useState<AudioState>({
    isMuted: false,
    isDeafened: false,
    volume: 75,
  })
  const [isAudioConnected, setIsAudioConnected] = useState(false)

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
          redrawCanvas(ctx, state.paths, canvas.width, canvas.height)
        }
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [state.paths])

  const startDrawing = useCallback(
    (point: Point) => {
      const newPath: DrawingPath = {
        id: `path-${Date.now()}`,
        points: [point],
        color: state.currentColor,
        tool: state.currentTool,
        width: state.brushSize,
      }
      setCurrentPath(newPath)
      setIsDrawing(true)
    },
    [state.currentColor, state.currentTool, state.brushSize],
  )

  const draw = useCallback(
    (point: Point) => {
      if (!isDrawing || !currentPath) return

      const updatedPath = {
        ...currentPath,
        points: [...currentPath.points, point],
      }
      setCurrentPath(updatedPath)

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (ctx) {
        drawPath(ctx, updatedPath)
      }
    },
    [isDrawing, currentPath],
  )

  const stopDrawing = useCallback(() => {
    if (currentPath && isDrawing) {
      setState((prev) => ({
        ...prev,
        paths: [...prev.paths, currentPath],
      }))
    }
    setIsDrawing(false)
    setCurrentPath(null)
  }, [currentPath, isDrawing])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const point = getMousePos(canvas, e.nativeEvent)
      startDrawing(point)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas && isDrawing) {
      const point = getMousePos(canvas, e.nativeEvent)
      draw(point)
    }
  }

  const handleMouseUp = () => {
    stopDrawing()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (canvas) {
      const point = getTouchPos(canvas, e.nativeEvent)
      startDrawing(point)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (canvas && isDrawing) {
      const point = getTouchPos(canvas, e.nativeEvent)
      draw(point)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    stopDrawing()
  }

  const handleToolChange = (tool: "pencil" | "eraser") => {
    setState((prev) => ({ ...prev, currentTool: tool }))
  }

  const handleColorChange = (color: string) => {
    setState((prev) => ({ ...prev, currentColor: color }))
  }

  const handleBrushSizeChange = (size: number) => {
    setState((prev) => ({ ...prev, brushSize: size }))
  }

  const handleClear = () => {
    setState((prev) => ({ ...prev, paths: [] }))
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: "user-1",
      username: "You",
      message,
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleToggleMute = () => {
    setAudioState((prev) => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const handleToggleDeafen = () => {
    setAudioState((prev) => ({ ...prev, isDeafened: !prev.isDeafened }))
  }

  const handleVolumeChange = (volume: number) => {
    setAudioState((prev) => ({ ...prev, volume }))
  }

  const handleAudioConnect = () => {
    setIsAudioConnected(true)
  }

  const handleAudioDisconnect = () => {
    setIsAudioConnected(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onLeaveRoom}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leave Room
          </Button>
          <div>
            <h1 className="text-xl font-semibold">CoolLaboratool</h1>
            <p className="text-sm text-gray-600">Room: {roomId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>3 participants</span>
          <Button variant="outline" size="sm" onClick={() => setIsChatOpen(!isChatOpen)} className="ml-4">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        state={state}
        onToolChange={handleToolChange}
        onColorChange={handleColorChange}
        onBrushSizeChange={handleBrushSizeChange}
        onClear={handleClear}
      />

      {/* Audio Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <AudioControls
          audioState={audioState}
          users={users}
          isConnected={isAudioConnected}
          onToggleMute={handleToggleMute}
          onToggleDeafen={handleToggleDeafen}
          onVolumeChange={handleVolumeChange}
          onConnect={handleAudioConnect}
          onDisconnect={handleAudioDisconnect}
        />
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair bg-white"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        users={users}
        currentUserId="user-1"
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

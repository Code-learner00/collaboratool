"use client"

import { useState } from "react"
import RoomSelector from "../components/room-selector"
import Whiteboard from "../components/whiteboard"

export default function Home() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)

  const handleJoinRoom = (roomId: string) => {
    setCurrentRoom(roomId)
  }

  const handleLeaveRoom = () => {
    setCurrentRoom(null)
  }

  if (currentRoom) {
    return <Whiteboard roomId={currentRoom} onLeaveRoom={handleLeaveRoom} />
  }

  return <RoomSelector onJoinRoom={handleJoinRoom} />
}

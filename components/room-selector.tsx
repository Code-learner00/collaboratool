"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Users } from "lucide-react"
import type { Room } from "../types/whiteboard"

interface RoomSelectorProps {
  onJoinRoom: (roomId: string) => void
}

export default function RoomSelector({ onJoinRoom }: RoomSelectorProps) {
  const [roomName, setRoomName] = useState("")
  const [joinRoomId, setJoinRoomId] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      const newRoomId = `room-${Date.now()}`
      onJoinRoom(newRoomId)
      setIsCreateDialogOpen(false)
      setRoomName("")
    }
  }

  const handleJoinRoom = () => {
    if (joinRoomId.trim()) {
      onJoinRoom(joinRoomId)
      setIsJoinDialogOpen(false)
      setJoinRoomId("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CoolLaboratool</h1>
          <p className="text-lg text-gray-600">Real-time collaborative whiteboard</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-400">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Plus className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Create New Room</h3>
                  <p className="text-gray-600 text-center">Start a new collaborative whiteboard session</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Room</DialogTitle>
                <DialogDescription>Give your whiteboard room a name to get started.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name..."
                    onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
                  />
                </div>
                <Button onClick={handleCreateRoom} className="w-full">
                  Create Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Users className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Join Room</h3>
                  <p className="text-gray-600 text-center">Enter a room ID to join an existing session</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Room</DialogTitle>
                <DialogDescription>Enter the room ID to join an existing whiteboard session.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="room-id">Room ID</Label>
                  <Input
                    id="room-id"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="Enter room ID..."
                    onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                  />
                </div>
                <Button onClick={handleJoinRoom} className="w-full">
                  Join Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

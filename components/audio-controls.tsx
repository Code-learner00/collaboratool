"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Mic, MicOff, Volume2, VolumeX, Settings, Phone, PhoneOff } from "lucide-react"
import type { AudioState, User } from "../types/whiteboard"

interface AudioControlsProps {
  audioState: AudioState
  users: User[]
  isConnected: boolean
  onToggleMute: () => void
  onToggleDeafen: () => void
  onVolumeChange: (volume: number) => void
  onConnect: () => void
  onDisconnect: () => void
}

export default function AudioControls({
  audioState,
  users,
  isConnected,
  onToggleMute,
  onToggleDeafen,
  onVolumeChange,
  onConnect,
  onDisconnect,
}: AudioControlsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedMic, setSelectedMic] = useState<string>("")

  useEffect(() => {
    // Get available audio devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInputs = devices.filter((device) => device.kind === "audioinput")
      setAudioDevices(audioInputs)
      if (audioInputs.length > 0 && !selectedMic) {
        setSelectedMic(audioInputs[0].deviceId)
      }
    })
  }, [selectedMic])

  const handleConnect = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true })
      onConnect()
    } catch (error) {
      console.error("Failed to access microphone:", error)
      alert("Failed to access microphone. Please check your permissions.")
    }
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Button variant="destructive" size="sm" onClick={onDisconnect} className="flex items-center gap-1">
            <PhoneOff className="h-4 w-4" />
            Disconnect
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={handleConnect} className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            Connect Audio
          </Button>
        )}
      </div>

      {isConnected && (
        <>
          {/* Mute Button */}
          <Button variant={audioState.isMuted ? "destructive" : "outline"} size="sm" onClick={onToggleMute}>
            {audioState.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Deafen Button */}
          <Button variant={audioState.isDeafened ? "destructive" : "outline"} size="sm" onClick={onToggleDeafen}>
            {audioState.isDeafened ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 min-w-[100px]">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={[audioState.volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={100}
              min={0}
              step={5}
              className="flex-1"
            />
            <span className="text-xs w-8 text-center">{audioState.volume}%</span>
          </div>

          {/* Audio Settings */}
          <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Audio Settings</h4>

                <div>
                  <label className="text-sm font-medium">Microphone</label>
                  <select
                    value={selectedMic}
                    onChange={(e) => setSelectedMic(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                  >
                    {audioDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Connected Users</label>
                  <div className="mt-2 space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user.color }} />
                          <span>{user.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {user.isMuted && <MicOff className="h-3 w-3 text-red-500" />}
                          <div className={`w-2 h-2 rounded-full ${user.isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}

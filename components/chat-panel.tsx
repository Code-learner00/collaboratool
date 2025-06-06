"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, X, Users } from "lucide-react"
import type { ChatMessage, User } from "../types/whiteboard"

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
  messages: ChatMessage[]
  users: User[]
  currentUserId: string
  onSendMessage: (message: string) => void
}

export default function ChatPanel({ isOpen, onClose, messages, users, currentUserId, onSendMessage }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-semibold">Chat</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Users List */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Online ({users.length})</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user.color }} />
              <span className={user.id === currentUserId ? "font-medium" : ""}>
                {user.username}
                {user.id === currentUserId && " (You)"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              {message.type === "system" ? (
                <div className="text-center text-xs text-gray-500 italic">{message.message}</div>
              ) : (
                <div className={`${message.userId === currentUserId ? "text-right" : "text-left"}`}>
                  <div className="text-xs text-gray-500 mb-1">
                    {message.username} • {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div
                    className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                      message.userId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

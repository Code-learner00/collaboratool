"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Pencil, Eraser, Palette, Minus, Plus } from "lucide-react"
import type { WhiteboardState } from "../types/whiteboard"

interface ToolbarProps {
  state: WhiteboardState
  onToolChange: (tool: "pencil" | "eraser") => void
  onColorChange: (color: string) => void
  onBrushSizeChange: (size: number) => void
  onClear: () => void
}

const colors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
]

export default function Toolbar({ state, onToolChange, onColorChange, onBrushSizeChange, onClear }: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Tool Selection */}
        <div className="flex items-center gap-2">
          <Button
            variant={state.currentTool === "pencil" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange("pencil")}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Pencil
          </Button>
          <Button
            variant={state.currentTool === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange("eraser")}
          >
            <Eraser className="h-4 w-4 mr-2" />
            Eraser
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded border-2 ${
                  state.currentColor === color ? "border-gray-800" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              />
            ))}
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Brush Size */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Minus className="h-4 w-4" />
          <Slider
            value={[state.brushSize]}
            onValueChange={(value) => onBrushSizeChange(value[0])}
            max={20}
            min={1}
            step={1}
            className="flex-1"
          />
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium w-6 text-center">{state.brushSize}</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Clear Button */}
        <Button variant="destructive" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </div>
    </div>
  )
}

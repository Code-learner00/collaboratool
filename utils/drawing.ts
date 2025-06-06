import type { Point, DrawingPath } from "../types/whiteboard"

export function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent): Point {
  const rect = canvas.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

export function getTouchPos(canvas: HTMLCanvasElement, e: TouchEvent): Point {
  const rect = canvas.getBoundingClientRect()
  return {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top,
  }
}

export function drawPath(ctx: CanvasRenderingContext2D, path: DrawingPath) {
  if (path.points.length < 2) return

  ctx.beginPath()
  ctx.strokeStyle = path.color
  ctx.lineWidth = path.width
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  if (path.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out"
  } else {
    ctx.globalCompositeOperation = "source-over"
  }

  ctx.moveTo(path.points[0].x, path.points[0].y)

  for (let i = 1; i < path.points.length; i++) {
    ctx.lineTo(path.points[i].x, path.points[i].y)
  }

  ctx.stroke()
}

export function redrawCanvas(ctx: CanvasRenderingContext2D, paths: DrawingPath[], width: number, height: number) {
  ctx.clearRect(0, 0, width, height)
  paths.forEach((path) => drawPath(ctx, path))
}

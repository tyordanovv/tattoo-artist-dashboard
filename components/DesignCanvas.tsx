'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, ZoomIn, ZoomOut } from 'lucide-react'

interface DesignCanvasProps {
  projectId: string
  url: string
}

export default function DesignCanvas({ projectId, url }: DesignCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(0.5) // Initial zoom level at 50%
  const [offset, setOffset] = useState({ x: 0, y: 0 }) // Image offset for panning
  const [isDragging, setIsDragging] = useState(false)
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      setImage(img)
    }
  }, [projectId, url])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions based on the container width and image aspect ratio
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      const aspectRatio = image.naturalHeight / image.naturalWidth
      canvas.height = container.clientWidth * aspectRatio
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate centered position with the current scale and offset
    const scaledWidth = image.naturalWidth * scale
    const scaledHeight = image.naturalHeight * scale
    const x = (canvas.width - scaledWidth) / 2 + offset.x
    const y = (canvas.height - scaledHeight) / 2 + offset.y

    ctx.drawImage(image, x, y, scaledWidth, scaledHeight)
  }, [image, scale, offset])

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const imageUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'design.png'
    a.click()
  }

  const handleZoom = (newScale: number) => {
    setScale(Math.max(0.1, Math.min(3, newScale))) // Limit zoom between 10% and 300%
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setStartDragPos({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const newOffset = {
        x: e.clientX - startDragPos.x,
        y: e.clientY - startDragPos.y,
      }
      setOffset(newOffset)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setStartDragPos({ x: touch.clientX - offset.x, y: touch.clientY - offset.y })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const touch = e.touches[0]
      const newOffset = {
        x: touch.clientX - startDragPos.x,
        y: touch.clientY - startDragPos.y,
      }
      setOffset(newOffset)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex flex-wrap justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(scale - 0.1)}
            disabled={scale <= 0.1}
          >
            <ZoomOut className="mr-2 h-4 w-4" /> Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(scale + 0.1)}
            disabled={scale >= 3}
          >
            <ZoomIn className="mr-2 h-4 w-4" /> Zoom In
          </Button>
          <span className="flex items-center px-2 text-sm text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={downloadCanvas}>
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>
      <div className="flex-1 overflow-hidden flex justify-center">
        <div className="w-full max-w-4xl">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </div>
    </div>
  )
}
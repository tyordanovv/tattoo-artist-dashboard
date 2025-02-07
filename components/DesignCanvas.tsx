'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eraser, Pen } from 'lucide-react'

interface DesignCanvasProps {
  projectId: string
}

export default function DesignCanvas({ projectId }: DesignCanvasProps) {
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = `/api/projects/${projectId}/design`
    img.onload = () => {
      setImage(img)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight - 200
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    }
  }, [projectId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - 200
      const ctx = canvas.getContext('2d')
      if (ctx && image) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [image])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true
    draw(e)
  }

  const stopDrawing = () => {
    isDrawing.current = false
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const rect = canvas?.getBoundingClientRect()
    const x = e.clientX - (rect?.left ?? 0)
    const y = e.clientY - (rect?.top ?? 0)

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : '#df4b26'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (image) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <div>
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
          >
            <Pen className="mr-2 h-4 w-4" /> Pen
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="ml-2"
          >
            <Eraser className="mr-2 h-4 w-4" /> Eraser
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={clearCanvas}>
          Clear Annotations
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}


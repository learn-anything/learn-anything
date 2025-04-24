import { useState, useEffect, useRef, ReactNode } from "react"
import { cn } from "~/lib/utils"

type ResizablePanelProps = {
  children: ReactNode
  className?: string
  width?: number
  minWidth?: number
  maxWidthPercent?: number
  onWidthChange?: (width: number) => void
}

export default function ResizablePanel({
  children,
  className,
  width = 250,
  minWidth = 250,
  maxWidthPercent = 0.4,
  onWidthChange,
}: ResizablePanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const maxWidth = window.innerWidth * maxWidthPercent
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth)

      if (onWidthChange) {
        onWidthChange(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, maxWidthPercent, minWidth, onWidthChange])

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * maxWidthPercent
      if (width > maxWidth && onWidthChange) {
        onWidthChange(maxWidth)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [maxWidthPercent, onWidthChange, width])

  return (
    <div
      ref={panelRef}
      style={{ width: `${width}px` }}
      className={cn("relative", className)}
    >
      {children}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent transition-colors"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

import { cn } from "@/lib/utils"
import * as React from "react"

interface ResizableCardProps {
  children: React.ReactNode
  className?: string
}

interface ResizablePanelProps {
  children: React.ReactNode
  className?: string
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  resizable?: "left" | "right" | "both" | "none"
}

interface ResizableCardContextType {
  panels: Map<string, { width: number; minWidth: number; maxWidth: number }>
  updatePanelWidth: (id: string, width: number) => void
  registerPanel: (id: string, width: number, minWidth: number, maxWidth: number) => void
  unregisterPanel: (id: string) => void
}

const ResizableCardContext = React.createContext<ResizableCardContextType | null>(null)

function ResizableCard({ children, className }: ResizableCardProps) {
  const [panels, setPanels] = React.useState<Map<string, { width: number; minWidth: number; maxWidth: number }>>(new Map())

  const updatePanelWidth = React.useCallback((id: string, width: number) => {
    setPanels(prev => {
      const newPanels = new Map(prev)
      const panel = newPanels.get(id)
      if (panel) {
        newPanels.set(id, { ...panel, width })
      }
      return newPanels
    })
  }, [])

  const registerPanel = React.useCallback((id: string, width: number, minWidth: number, maxWidth: number) => {
    setPanels(prev => {
      const newPanels = new Map(prev)
      newPanels.set(id, { width, minWidth, maxWidth })
      return newPanels
    })
  }, [])

  const unregisterPanel = React.useCallback((id: string) => {
    setPanels(prev => {
      const newPanels = new Map(prev)
      newPanels.delete(id)
      return newPanels
    })
  }, [])

  const contextValue = React.useMemo(
    () => ({ panels, updatePanelWidth, registerPanel, unregisterPanel }),
    [panels, updatePanelWidth, registerPanel, unregisterPanel]
  )

  return (
    <ResizableCardContext.Provider value={contextValue}>
      <div className={cn("flex h-full w-full", className)}>
        {children}
      </div>
    </ResizableCardContext.Provider>
  )
}

function ResizablePanel({
  children,
  className,
  defaultWidth = 300,
  minWidth = 200,
  maxWidth = 600,
  resizable = "none"
}: ResizablePanelProps) {
  const context = React.useContext(ResizableCardContext)
  const [id] = React.useState(() => Math.random().toString(36).substr(2, 9))
  const [width, setWidth] = React.useState(defaultWidth)
  const [isDraggingLeft, setIsDraggingLeft] = React.useState(false)
  const [isDraggingRight, setIsDraggingRight] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const startXRef = React.useRef(0)
  const startWidthRef = React.useRef(0)

  if (!context) {
    throw new Error("ResizablePanel must be used within ResizableCard")
  }

  const registerPanelFn = context.registerPanel
  const unregisterPanelFn = context.unregisterPanel
  const updatePanelWidthFn = context.updatePanelWidth

  React.useEffect(() => {
    registerPanelFn(id, defaultWidth, minWidth, maxWidth)
    return () => unregisterPanelFn(id)
  }, [id, defaultWidth, minWidth, maxWidth, registerPanelFn, unregisterPanelFn])

  const handleMouseDownLeft = React.useCallback((e: React.MouseEvent) => {
    if (resizable === "left" || resizable === "both") {
      e.preventDefault()
      setIsDraggingLeft(true)
      startXRef.current = e.clientX
      startWidthRef.current = width
    }
  }, [resizable, width])

  const handleMouseDownRight = React.useCallback((e: React.MouseEvent) => {
    if (resizable === "right" || resizable === "both") {
      e.preventDefault()
      setIsDraggingRight(true)
      startXRef.current = e.clientX
      startWidthRef.current = width
    }
  }, [resizable, width])

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft) {
        const delta = e.clientX - startXRef.current
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current - delta))
        setWidth(newWidth)
        updatePanelWidthFn(id, newWidth)
      } else if (isDraggingRight) {
        const delta = e.clientX - startXRef.current
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta))
        setWidth(newWidth)
        updatePanelWidthFn(id, newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingLeft(false)
      setIsDraggingRight(false)
    }

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isDraggingLeft, isDraggingRight, minWidth, maxWidth, updatePanelWidthFn, id])

  const showLeftHandle = resizable === "left" || resizable === "both"
  const showRightHandle = resizable === "right" || resizable === "both"

  return (
    <div
      ref={panelRef}
      className={cn("relative flex-shrink-0 h-full", className)}
      style={{ width: `${width}px` }}
    >
      {/* Left Resize Handle */}
      {showLeftHandle && (
        <div
          onMouseDown={handleMouseDownLeft}
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-10",
            isDraggingLeft && "bg-primary"
          )}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-border rounded-full" />
        </div>
      )}

      {/* Content */}
      <div className="h-full overflow-auto">
        {children}
      </div>

      {/* Right Resize Handle */}
      {showRightHandle && (
        <div
          onMouseDown={handleMouseDownRight}
          className={cn(
            "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-10",
            isDraggingRight && "bg-primary"
          )}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-border rounded-full" />
        </div>
      )}
    </div>
  )
}

function ResizableContent({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex-1 h-full overflow-auto", className)}>
      {children}
    </div>
  )
}

export { ResizableCard, ResizableContent, ResizablePanel }


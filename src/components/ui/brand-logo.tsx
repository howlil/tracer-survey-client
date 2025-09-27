import { cn } from "@/lib/utils"
import * as React from "react"

interface BrandLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  onClick?: () => void
}

function BrandLogo({
  className,
  size = "md",
  showText = true,
  onClick,
  ...props
}: BrandLogoProps) {
  const logoSize = React.useMemo(() => {
    switch (size) {
      case "sm": return "h-8 w-8"
      case "md": return "h-10 w-10"
      case "lg": return "h-12 w-12"
      default: return "h-10 w-10"
    }
  }, [size])

  const imageSize = React.useMemo(() => {
    switch (size) {
        case "sm": return "h-8 w-8"
        case "md": return "h-10 w-10"
        case "lg": return "h-12 w-12"
        default: return "h-10 w-10"
    }
  }, [size])

  const textSize = React.useMemo(() => {
    switch (size) {
      case "sm": return "text-sm"
      case "md": return "text-lg"
      case "lg": return "text-xl"
      default: return "text-lg"
    }
  }, [size])

  const subtitleSize = React.useMemo(() => {
    switch (size) {
      case "sm": return "text-xs"
      case "md": return "text-xs"
      case "lg": return "text-sm"
      default: return "text-xs"
    }
  }, [size])

  return (
    <div
      className={cn(
        "flex items-center space-x-3",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Logo */}
      <div className={cn(
        "rounded-lg overflow-hidden bg-transparent flex items-center justify-center",
        logoSize
      )}>
        <img
          src="/assets/unand.png"
          alt="Universitas Andalas"
          className={cn("object-contain", imageSize)}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="block">
          <div className={cn("font-semibold leading-tight", textSize)}>
            Tracer Study & User Survey
          </div>
          <div className={cn("text-muted-foreground leading-tight font-medium", subtitleSize)}>
            Universitas Andalas
          </div>
        </div>
      )}
    </div>
  )
}

export { BrandLogo }
export type { BrandLogoProps }


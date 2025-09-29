import { cn } from "@/lib/utils"

interface AdminFooterProps {
  className?: string
}

function AdminFooter({
  className,
  ...props
}: AdminFooterProps) {
  return (
    <footer
      className={cn(
        "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Tracer Study & User Survey - Universitas Andalas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { AdminFooter }
export type { AdminFooterProps }


import { cn } from "@/lib/utils"
import * as React from "react"
import { Footer } from "./Footer"
import { Navbar } from "./Navbar"

interface LayoutProps {
  children: React.ReactNode
  className?: string
  showNavbar?: boolean
  showFooter?: boolean
  navbarProps?: React.ComponentProps<typeof Navbar>
  footerProps?: React.ComponentProps<typeof Footer>
  containerClassName?: string
  contentClassName?: string
}

function Layout({
  children,
  className,
  showNavbar = true,
  showFooter = true,
  navbarProps,
  footerProps,
  containerClassName,
  contentClassName,
  ...props
}: LayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-background",
        className
      )}
      {...props}
    >
      {/* Navbar */}
      {showNavbar && (
        <Navbar {...navbarProps} />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1",
          containerClassName
        )}
      >
        <div
          className={cn(
            "w-full",
            contentClassName
          )}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer {...footerProps} />
      )}
    </div>
  )
}

export { Layout }
export type { LayoutProps }


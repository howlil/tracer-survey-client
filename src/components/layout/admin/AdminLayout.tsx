import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import * as React from "react"
import { AdminFooter } from "./AdminFooter"
import { AdminNavbar } from "./AdminNavbar"
import { AdminSidebar } from "./AdminSidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  className?: string
}

function AdminLayout({
  children,
  className,
  ...props
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <AdminNavbar 
        onMenuToggle={handleMobileMenuToggle}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
          className="hidden lg:block"
        />

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-background border-r">
              <AdminSidebar
                isCollapsed={false}
                onToggle={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className={cn("h-full", className)} {...props}>
              {children}
            </div>
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </div>
  )
}

export { AdminLayout }
export type { AdminLayoutProps }


import { cn } from "@/lib/utils"
import {
  BarChart3,
  ChevronLeft,
  FileText,
  Home,
  LogOut,
  Settings,
  Users
} from "lucide-react"
import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface AdminSidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggle?: () => void
}

interface SidebarItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/admin/dashboard"
  },
  {
    label: "Tracer Study",
    icon: FileText,
    href: "/admin/tracer-study"
  },
  {
    label: "User Survey",
    icon: Users,
    href: "/admin/user-survey"
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings"
  }
]

function AdminSidebar({
  className,
  isCollapsed = false,
  onToggle,
  ...props
}: AdminSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleItemClick = (href: string) => {
    navigate(href)
  }

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/")
  }

  return (
    <aside
      className={cn(
        "h-full bg-background border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">
              Admin Panel
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <ChevronLeft 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )} 
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <button
                key={item.href}
                onClick={() => handleItemClick(item.href)}
                className={cn(
                  "w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg text-left transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Logout Button - Bottom */}
        <div className="p-4">
          <button
            onClick={() => navigate("/admin/login")}
            className={cn(
              "w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg text-left transition-colors text-destructive hover:text-destructive/80 hover:bg-destructive/10",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
          
          {/* Footer */}
          {!isCollapsed && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-muted-foreground text-center">
                Admin Panel v1.0
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export { AdminSidebar }
export type { AdminSidebarProps }


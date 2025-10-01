import { cn } from "@/lib/utils"
import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Database,
    File,
    FileBarChart,
    FileText,
    Home,
    LogOut,
    Mail,
    Package,
    Send,
    UserCheck,
    UserCog,
    UserPlus,
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
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/admin/dashboard"
  },
  {
    label: "Manajemen Pengguna",
    icon: Users,
    href: "/admin/users",
    children: [
      {
        label: "Kelola Admin",
        icon: UserCog,
        href: "/admin/users/admins"
      },
      {
        label: "Kelola Grup Admin",
        icon: UserCheck,
        href: "/admin/users/admin-groups"
      },
      {
        label: "Database Alumni",
        icon: Database,
        href: "/admin/users/alumni"
      },
      {
        label: "Database Pengguna Alumni",
        icon: UserPlus,
        href: "/admin/users/alumni-users"
      }
    ]
  },
  {
    label: "Manajemen Paket Soal",
    icon: Package,
    href: "/admin/packages",
    children: [
      {
        label: "Kelola Paket Soal Tracer Study",
        icon: FileText,
        href: "/admin/packages/tracer-study"
      },
      {
        label: "Kelola Paket Soal User Survey",
        icon: Users,
        href: "/admin/packages/user-survey"
      }
    ]
  },
  {
    label: "Laporan & Rekap",
    icon: FileBarChart,
    href: "/admin/reports",
    children: [
      {
        label: "Rekap Tracer Study",
        icon: BarChart3,
        href: "/admin/reports/tracer-study"
      },
      {
        label: "Rekap User Survey",
        icon: BarChart3,
        href: "/admin/reports/user-survey"
      }
    ]
  },
  {
    label: "Manajemen Email",
    icon: Mail,
    href: "/admin/email",
    children: [
      {
        label: "Kirim Email",
        icon: Send,
        href: "/admin/email/send"
      },
      {
        label: "Kelola Template Email",
        icon: File,
        href: "/admin/email/templates"
      }
    ]
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
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())
  const [persistentHoveredItem, setPersistentHoveredItem] = React.useState<string | null>(null)

  const handleItemClick = (href: string) => {
    navigate(href)
  }

  const handleParentClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle expanded state
      const newExpanded = new Set(expandedItems)
      if (newExpanded.has(item.href)) {
        newExpanded.delete(item.href)
      } else {
        newExpanded.add(item.href)
      }
      setExpandedItems(newExpanded)
    } else {
      navigate(item.href)
    }
  }

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/")
  }

  const isParentActive = (item: SidebarItem) => {
    if (!item.children) return false
    return item.children.some(child => isActive(child.href))
  }

  const handleMouseEnter = (item: SidebarItem) => {
    if (isCollapsed && item.children && item.children.length > 0) {
      setPersistentHoveredItem(item.href)
    }
  }

  const handleMouseLeave = () => {
    // Don't clear persistentHoveredItem here - let it stay open
  }

  const handlePersistentHoverLeave = () => {
    // Only clear persistent hover when leaving the entire hover area
    setPersistentHoveredItem(null)
  }

  // Close persistent hover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.sidebar-container')) {
        setPersistentHoveredItem(null)
      }
    }

    if (persistentHoveredItem) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [persistentHoveredItem])

  return (
    <aside
      className={cn(
        "sidebar-container h-full bg-background border-r transition-all duration-300",
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
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const parentActive = isParentActive(item)
            const isExpanded = expandedItems.has(item.href)
            const hasChildren = item.children && item.children.length > 0
            const isPersistentHovered = persistentHoveredItem === item.href
            
            return (
              <div 
                key={item.href} 
                className="relative space-y-1"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Parent Item */}
                <button
                  onClick={() => handleParentClick(item)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg text-left transition-colors",
                    (active || parentActive)
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
                      {hasChildren && (
                        <ChevronRight 
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )}
                        />
                      )}
                      {item.badge && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Children Items - Normal Mode */}
                {hasChildren && isExpanded && !isCollapsed && (
                  <div className="ml-4 space-y-1">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon
                      const childActive = isActive(child.href)
                      
                      return (
                        <button
                          key={child.href}
                          onClick={() => handleItemClick(child.href)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-2 py-2 rounded-lg text-left transition-colors text-sm",
                            childActive
                              ? "bg-primary/10 text-primary border-l-2 border-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="font-medium flex-1">
                            {child.label}
                          </span>
                          {child.badge && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Children Items - Collapsed Hover Mode */}
                {isCollapsed && hasChildren && isPersistentHovered && (
                  <div 
                    className="absolute left-full top-0 ml-2 z-50 min-w-48 bg-background border border-border rounded-lg shadow-lg py-2"
                    onMouseLeave={handlePersistentHoverLeave}
                  >
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon
                      const childActive = isActive(child.href)
                      
                      return (
                        <button
                          key={child.href}
                          onClick={() => {
                            handleItemClick(child.href)
                            setPersistentHoveredItem(null)
                          }}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors text-sm",
                            childActive
                              ? "bg-primary/10 text-primary border-l-2 border-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="font-medium flex-1">
                            {child.label}
                          </span>
                          {child.badge && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
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


import { BrandLogo } from "@/components/ui/brand-logo"
import { cn } from "@/lib/utils"
import { ChevronDown, Key, LogOut, Menu, User, X } from "lucide-react"
import * as React from "react"
import { useNavigate } from "react-router-dom"

interface AdminNavbarProps {
  className?: string
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

function AdminNavbar({
  className,
  onMenuToggle,
  isMenuOpen = false,
  ...props
}: AdminNavbarProps) {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)

  const handleMenuToggle = onMenuToggle || (() => {
    setMobileMenuOpen(!mobileMenuOpen)
  })

  // Navigation handlers
  const handleDashboard = () => {
    navigate("/admin/dashboard")
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/admin/login")
    setMobileMenuOpen(false)
    setUserDropdownOpen(false)
  }

  const handleChangePassword = () => {
    // Handle change password logic here
    console.log("Change password clicked")
    setUserDropdownOpen(false)
  }

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('[data-dropdown]')) {
          setUserDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userDropdownOpen])

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-sm",
        className
      )}
      {...props}
    >
      <div className="w-full px-4">
        <div className="flex h-16 items-center justify-between w-full">
          {/* Logo dan Brand - Kiri */}
          <div className="flex items-center">
            <BrandLogo
              size="md"
              showText={true}
              onClick={handleDashboard}
            />
          </div>

          {/* Admin Actions - Kanan */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            <div className="hidden md:block relative" data-dropdown>
              <button
                onClick={handleUserDropdownToggle}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-md hover:bg-muted/50"
              >
                <User className="h-4 w-4" />
                <span>Admin</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Key className="h-4 w-4" />
                    <span>Ganti Password</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="p-2 text-foreground hover:text-primary transition-colors md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full right-4 z-50 mt-2">
          <div className="bg-background border rounded-lg shadow-lg py-2 min-w-[200px]">
            <div className="px-4 py-2 border-b">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
            </div>
            
            <button
              onClick={handleChangePassword}
              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Key className="h-4 w-4" />
              <span>Ganti Password</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export { AdminNavbar }
export type { AdminNavbarProps }


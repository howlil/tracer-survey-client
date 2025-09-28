import { BrandLogo } from "@/components/ui/brand-logo"
import { cn } from "@/lib/utils"
import { ChevronDown, Menu, X } from "lucide-react"
import * as React from "react"
import { useNavigate } from "react-router-dom"

interface NavbarProps {
  className?: string
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

function Navbar({
  className,
  onMenuToggle,
  isMenuOpen = false,
  ...props
}: NavbarProps) {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleMenuToggle = onMenuToggle || (() => {
    setMobileMenuOpen(!mobileMenuOpen)
  })

  // Navigation handlers
  const handleHome = () => {
    navigate("/")
    setMobileMenuOpen(false)
  }

  const handleTracerStudy = () => {
    navigate("/tracer-study")
    setMobileMenuOpen(false)
  }

  const handleUserSurvey = () => {
    navigate("/user-survey")
    setMobileMenuOpen(false)
  }

  const handleFAQ = () => {
    navigate("/faq")
    setMobileMenuOpen(false)
  }

  const handleContactUs = () => {
    // Scroll to footer
    const footer = document.querySelector('footer')
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-sm",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center relative">
          {/* Logo dan Brand - Kiri */}
          <div className="flex items-center">
            <BrandLogo
              size="md"
              showText={true}
              onClick={handleHome}
            />
          </div>

          {/* Desktop Navigation - Tengah (Absolute Positioned) */}
          <div className="hidden md:flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleHome}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group pb-1"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors relative flex items-center space-x-1 pb-1">
                <span>Survey</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-80 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 space-y-2">
                  <button 
                    onClick={handleTracerStudy}
                    className="block w-full text-left p-2 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <div className="text-sm font-medium text-foreground">Tracer Study</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Survei untuk melacak perjalanan karier alumni dan mengevaluasi kualitas pendidikan
                    </p>
                  </button>
                  <button 
                    onClick={handleUserSurvey}
                    className="block w-full text-left p-2 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <div className="text-sm font-medium text-foreground">User Survey</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Survei kepuasan pengguna untuk meningkatkan kualitas layanan dan fasilitas
                    </p>
                  </button>
                </div>
              </div>
            </div>


            <button
              onClick={handleFAQ}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group pb-1"
            >
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Contact Us - Kanan */}
          <div className="hidden md:flex items-center ml-auto space-x-4">
            <button 
              onClick={handleContactUs}
              className="text-sm font-medium text-primary hover:text-white hover:bg-primary/80 transition-colors py-2 rounded-md"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden ml-auto">
            <button
              onClick={handleMenuToggle}
              className="p-2 text-foreground hover:text-primary transition-colors"
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
            <button
              onClick={handleHome}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Home
            </button>
            
            <button 
              onClick={handleTracerStudy}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Tracer Study
            </button>
            
            <button 
              onClick={handleUserSurvey}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              User Survey
            </button>
            
            <button 
              onClick={handleFAQ}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              FAQ
            </button>
            
            <button 
              onClick={handleContactUs}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export { Navbar }
export type { NavbarProps }


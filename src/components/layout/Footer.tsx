import { BrandLogo } from "@/components/ui/brand-logo"
import { cn } from "@/lib/utils"
import {
  Award,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Twitter,
  Users
} from "lucide-react"

interface FooterProps {
  className?: string
  showSocialLinks?: boolean
  showContactInfo?: boolean
  showQuickLinks?: boolean
  companyInfo?: {
    name: string
    description: string
    address: string
    phone: string
    email: string
    website: string
  }
  quickLinks?: {
    label: string
    href: string
    external?: boolean
  }[]
  socialLinks?: {
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin'
    href: string
  }[]
}

function Footer({
  className,
  showSocialLinks = true,
  showContactInfo = true,
  showQuickLinks = true,
  companyInfo = {
    name: "Tracer Study & User Survey",
    description: "Platform tracer study dan survei online Universitas Andalas untuk mengumpulkan data alumni dan feedback pengguna.",
    address: "Kampus Universitas Andalas, Limau Manis, Padang, Sumatera Barat 25163",
    phone: "+62 751 71183",
    email: "tracer@unand.ac.id",
    website: "https://tracer.unand.ac.id"
  },
  quickLinks = [
    { label: "Tentang Tracer Study", href: "/about" },
    { label: "Panduan Penggunaan", href: "/guide" },
    { label: "FAQ", href: "/faq" },
    { label: "Kontak", href: "/contact" },
    { label: "Bantuan", href: "/help" },
    { label: "Kebijakan Privasi", href: "/privacy", external: true },
    { label: "Syarat & Ketentuan", href: "/terms", external: true }
  ],
  socialLinks = [
    { platform: 'facebook', href: 'https://facebook.com/unand.official' },
    { platform: 'twitter', href: 'https://twitter.com/unand_official' },
    { platform: 'instagram', href: 'https://instagram.com/unand_official' },
    { platform: 'linkedin', href: 'https://linkedin.com/school/universitas-andalas' }
  ],
  ...props
}: FooterProps) {

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />
      case 'twitter':
        return <Twitter className="h-4 w-4" />
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  return (
    <footer
      className={cn(
        "bg-background border-t",
        className
      )}
      {...props}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <BrandLogo
              size="lg"
              showText={true}
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {companyInfo.description}
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>10K+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-3 w-3" />
                <span>Trusted</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {showQuickLinks && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
                    >
                      <span>{link.label}</span>
                      {link.external && <ExternalLink className="h-3 w-3" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          {showContactInfo && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Kontak Kami</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {companyInfo.address}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {companyInfo.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {companyInfo.email}
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Social Links */}
        {showSocialLinks && (
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Ikuti kami:</span>
                <div className="flex items-center space-x-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>© 2025 {companyInfo.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}

export { Footer }
export type { FooterProps }


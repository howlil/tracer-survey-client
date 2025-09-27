import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ArrowLeft, Lock, Shield, User } from "lucide-react"
import * as React from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useNavigate } from "react-router-dom"

function LoginTracerStudy() {
  const navigate = useNavigate()
  const recaptchaRef = React.useRef<ReCAPTCHA>(null)
  
  const [formData, setFormData] = React.useState({
    pin: ""
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [captchaValue, setCaptchaValue] = React.useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
    if (error) {
      setError("")
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.pin.trim()) {
      newErrors.pin = "PIN harus diisi"
    } else if (formData.pin.length < 6) {
      newErrors.pin = "PIN minimal 6 karakter"
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.pin)) {
      newErrors.pin = "PIN hanya boleh berisi huruf dan angka"
    }

    if (import.meta.env.VITE_RECAPTCHA_SITE_KEY && !captchaValue) {
      newErrors.captcha = "Captcha harus diselesaikan"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      setError("")
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
         // Demo validation
         if (formData.pin === "123456" || formData.pin === "ABC123") {
          console.log("Login successful:", formData)
          // TODO: Navigate to survey form
          alert("Login berhasil! (Demo)")
        } else {
          setError("PIN tidak valid")
        }
      } catch (err) {
        setError("Terjadi kesalahan saat login")
      } finally {
        setIsLoading(false)
        // Reset captcha
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setCaptchaValue(null)
      }
    }
  }

  const handleBack = () => {
    navigate("/tracer-study")
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Login Tracer Study
              </h1>
              <p className="text-muted-foreground">
                Masukkan PIN yang telah diberikan untuk mengakses survei
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-background border rounded-2xl shadow-xl p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* PIN Field */}
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-sm font-medium">
                    PIN Tracer Study
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pin"
                      name="pin"
                      type="text"
                        placeholder="Masukkan PIN (6 karakter)"
                      value={formData.pin}
                      onChange={handleInputChange}
                        maxLength={20}
                      className={cn(
                        "pl-10",
                        errors.pin && "border-destructive focus:border-destructive"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.pin && (
                    <p className="text-xs text-destructive">{errors.pin}</p>
                  )}
                </div>

                {/* Captcha Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Verifikasi Keamanan
                  </Label>
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY_DEMO}
                      onChange={handleCaptchaChange}
                      theme="light"
                      size="normal"
                    />
                  </div>
                  {errors.captcha && (
                    <p className="text-xs text-destructive text-center">{errors.captcha}</p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive text-center">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Masuk ke Survei</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Back Button */}
              <div className="text-center">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali ke Halaman Utama</span>
                </button>
              </div>

              {/* Additional Info */}
              <div className="text-center space-y-2 pt-4 border-t">
                <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                  <span>© 2025 Tracer Study & User Survey</span>
                  <span>Universitas Andalas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LoginTracerStudy

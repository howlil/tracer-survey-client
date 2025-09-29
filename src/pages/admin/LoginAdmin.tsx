import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

function LoginAdmin() {
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password harus diisi"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (credentials: { username: string; password: string }) => {
    setIsLoading(true)
    setError("")
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Demo validation
      if (credentials.username === "admin" && credentials.password === "admin123") {
        console.log("Login successful:", credentials)
        toast.success("Login berhasil!", {
          description: "Selamat datang di panel admin",
          duration: 3000,
        })
        // Navigate to dashboard after successful login
        setTimeout(() => {
          navigate("/admin/dashboard")
        }, 1000)
      } else {
        setError("Username atau password salah")
        toast.error("Login gagal!", {
          description: "Username atau password salah",
          duration: 3000,
        })
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login")
      toast.error("Terjadi kesalahan!", {
        description: "Silakan coba lagi nanti",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      handleLogin(formData)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
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
                Admin Login
              </h1>
              <p className="text-muted-foreground">
                Masuk ke dashboard admin Tracer Study & User Survey
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-background border rounded-2xl shadow-xl p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={cn(
                      "pl-10",
                      errors.username && "border-destructive focus:border-destructive"
                    )}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={cn(
                      "pl-10 pr-10",
                      errors.password && "border-destructive focus:border-destructive"
                    )}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
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
                  "Masuk"
                )}
              </Button>
              </form>

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

export default LoginAdmin


import { BrandLogo } from "@/components/ui/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, RotateCcw } from "lucide-react"
import { useNavigate } from "react-router-dom"

function TracerStudySuccess() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate("/")
  }

  const handleBackToTracerStudy = () => {
    navigate("/tracer-study")
  }

  const handleRestart = () => {
    navigate("/tracer-study/survey/1")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <BrandLogo
              size="md"
              showText={true}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-4">
                Terima Kasih!
              </CardTitle>
              <CardDescription className="text-lg">
                Survey Tracer Study Anda telah berhasil disubmit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Data yang Anda berikan sangat berharga untuk pengembangan 
                  program studi di Universitas Andalas.
                </p>
                <p className="text-sm text-muted-foreground">
                  Hasil survey ini akan digunakan untuk evaluasi dan perbaikan 
                  kualitas pendidikan di masa yang akan datang.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleBackToHome} variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </Button>
                <Button onClick={handleBackToTracerStudy} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Kembali ke Tracer Study
                </Button>
                <Button onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Isi Ulang Survey
                </Button>
              </div>

              <div className="pt-6 border-t">
                <p className="text-xs text-muted-foreground">
                  © 2024 Tracer Study & User Survey - Universitas Andalas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TracerStudySuccess

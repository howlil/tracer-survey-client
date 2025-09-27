import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  const handleStartTracerStudy = () => {
    navigate("/tracer-study")
  }

  const handleStartUserSurvey = () => {
    navigate("/user-survey")
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Tracer Study & User Survey
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Platform tracer study dan survei online Universitas Andalas untuk mengumpulkan data alumni dan feedback pengguna
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartTracerStudy}
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                Mulai Tracer Study
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleStartUserSurvey}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                User Survey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Mengapa Memilih Platform Kami?
              </h2>
              <p className="text-lg text-muted-foreground">
                Platform yang dirancang khusus untuk mendukung program Merdeka Belajar Kemendikbudristek
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background border rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Tracer Study</h3>
                <p className="text-muted-foreground">
                  Kumpulkan data status alumni untuk mengukur Indikator Kinerja Utama (IKU) perguruan tinggi
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Data lulusan yang bekerja</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Data wirausaha alumni</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Data melanjutkan studi</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background border rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">User Survey</h3>
                <p className="text-muted-foreground">
                  Survei kepuasan pengguna untuk meningkatkan kualitas layanan dan fasilitas kampus
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Feedback layanan akademik</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Evaluasi fasilitas kampus</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Kepuasan mahasiswa</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background border rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Merdeka Belajar</h3>
                <p className="text-muted-foreground">
                  Mendukung program Kemendikbudristek untuk meningkatkan kualitas pendidikan tinggi
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Peringkat perguruan tinggi</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Akreditasi program studi</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Kualitas pembelajaran</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center bg-primary/5 border border-primary/20 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Siap Memulai?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Bergabunglah dengan ribuan alumni dan mahasiswa yang telah berkontribusi dalam meningkatkan kualitas pendidikan di Universitas Andalas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartTracerStudy}
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                Mulai Tracer Study
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleStartUserSurvey}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                User Survey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home

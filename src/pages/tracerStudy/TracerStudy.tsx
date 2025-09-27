import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface TracerStudyData {
  title: string
  greeting: {
    islamic: string
    general: string
  }
  addressee: string
  introduction: string
  ikuList: {
    title: string
    items: string[]
  }
  purpose: string
  expectation: string
  signOff: {
    department: string
    university: string
  }
}

const tracerStudyData: TracerStudyData = {
  title: "Tracer Study Lulusan Universitas Andalas",
  greeting: {
    islamic: "Assalaamu'alaikum warahmatullaahi wabarakatuh",
    general: "Salam sejahtera untuk kita semua"
  },
  addressee: "Kepada Yth. lulusan Universitas Andalas wisuda tahun 2023 Dimana saja berada.",
  introduction: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek) telah meluncurkan program 'Merdeka Belajar' yang mencakup beberapa terobosan untuk meningkatkan kualitas pendidikan tinggi. Salah satunya adalah delapan indikator kinerja utama (IKU) perguruan tinggi yang menjadi indikator keberhasilan proses pembelajaran. IKU ini juga menjadi indikator peringkat perguruan tinggi nasional.",
  ikuList: {
    title: "Indikator Kinerja Utama (IKU) yang diukur:",
    items: [
      "Jumlah Lulusan mendapat pekerjaan",
      "Jumlah Lulusan yang menjadi wirausaha, atau",
      "Jumlah Lulusan yang melanjutkan studi",
      "Jumlah lulusan yang belum bekerja/tidak bekerja"
    ]
  },
  purpose: "Untuk mengukur kinerja tersebut, Perguruan Tinggi diwajibkan mengumpulkan data dari seluruh alumni yang telah lulus atau diwisuda dalam kurun waktu 1 tahun terakhir. Untuk keperluan tersebut, UPT Karir dan Konseling ditugaskan untuk menghubungi seluruh lulusan tahun 2023, mulai dari D3, S1, dan program profesi dokter/gigi, untuk memperoleh data status alumni terkini.",
  expectation: "Partisipasi seluruh alumni sangat diharapkan untuk mengumpulkan data dan masukan agar Unand menjadi lebih baik. Atas perhatian dan partisipasinya, kami ucapkan terima kasih. Untuk informasi lebih lanjut, dapat menghubungi:",
  signOff: {
    department: "Pusat Karir, Konseling, dan Tracer Study",
    university: "Universitas Andalas"
  },
}

function TracerStudy() {
  const navigate = useNavigate()
  
  const handleStartTracerStudy = () => {
    navigate("/tracer-study/login")
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full">
            <div className="grid lg:grid-cols-5 gap-12 items-stretch">
              {/* Left Side - Header dengan Frame Gambar */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                {/* Header */}
                <div className="text-center lg:text-left space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    {tracerStudyData.title}
                  </h1>
                </div>

                {/* Gambar Ilustrasi */}
                <div className="items-center py-6">
                  <img 
                    src="/assets/tracerStudy.png" 
                    alt="Tracer Study Illustration"
                    className="w-full h-auto"
                  />
                </div>

                {/* CTA Button - Desktop Only */}
                <div className="hidden lg:flex flex-1 text-center items-center justify-center pb-16">
                  <Button
                    onClick={handleStartTracerStudy}
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-white hover:rounded-0 text-white hover:text-primary border-2 border-primary transition-all duration-300"
                  >
                    <span>Mulai Tracer Study</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Main Content Card */}
                <div className="bg-background border rounded-2xl shadow-xl p-6 space-y-6">
                  {/* Greeting */}
                  <div className="text-center space-y-3">
                    <p className="text-lg font-medium text-foreground">
                      {tracerStudyData.greeting.islamic}
                    </p>
                    <p className="text-lg font-medium text-foreground">
                      {tracerStudyData.greeting.general}
                    </p>
                  </div>

                  {/* Addressee */}
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground">
                      {tracerStudyData.addressee}
                    </p>
                  </div>

                  {/* Introduction */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed text-sm text-justify">
                      {tracerStudyData.introduction}
                    </p>
                  </div>

                  {/* IKU List */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {tracerStudyData.ikuList.title}
                    </h3>
                    <div className="space-y-2">
                      {tracerStudyData.ikuList.items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-semibold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-foreground leading-relaxed text-sm">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed text-sm text-justify">
                      {tracerStudyData.purpose}
                    </p>
                  </div>

                  {/* Expectation */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed text-sm text-justify">
                      {tracerStudyData.expectation}
                    </p>
                  </div>

                  {/* Sign Off */}
                  <div className="text-center space-y-1 pt-2">
                    <p className="text-sm font-semibold text-foreground">
                      {tracerStudyData.signOff.department}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {tracerStudyData.signOff.university}
                    </p>
                  </div>
                </div>

                {/* CTA Button - Mobile Only */}
                <div className="lg:hidden text-center py-8">
                  <Button
                    onClick={handleStartTracerStudy}
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-white hover:rounded-0 text-white hover:text-primary border-2 border-primary transition-all duration-300"
                  >
                    <span>Mulai Tracer Study</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TracerStudy

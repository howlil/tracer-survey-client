import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface UserSurveyData {
  title: string
  greeting: {
    islamic: string
    general: string
  }
  content: string[]
  closing: string
  links: {
    suratPengantar: string
  }
  signOff: {
    department: string
    university: string
  }
}

const userSurveyData: UserSurveyData = {
  title: "User Survey Universitas Andalas",
  greeting: {
    islamic: "Assalaamu'alaikum warahmatullaahi wabarakatuh",
    general: "Salam sejahtera untuk kita semua"
  },
  content: [
    "Yth. Bapak/Ibu atasan dari lulusan Universitas Andalas",
    "Di tempat",
    "Dengan hormat,",
    "",
    "Universitas Andalas sedang melakukan survei untuk lulusan kami guna mengevaluasi tujuan pembelajaran, proses pembelajaran, dan hasil pembelajaran. Kami memohon kesediaan Bapak/Ibu untuk memberikan umpan balik dan penilaian terhadap lulusan yang bekerja di bawah pengawasan Bapak/Ibu.",
    "",
    "Umpan balik yang Bapak/Ibu berikan akan sangat bermanfaat untuk pengembangan proses pembelajaran di Universitas Andalas. Survei ini juga bertujuan untuk mengumpulkan saran, kritik, dan harapan masyarakat terhadap kualitas lulusan Universitas Andalas.",
    "",
    "Bapak/Ibu dapat memberikan masukan dengan mengakses tautan yang telah disediakan dan menggunakan token survei yang dikirim melalui email.",
    "",
    "Surat Pengantar: Pengantar Rektor DUDI 2024"
  ],
  closing: "Atas partisipasi Bapak/Ibu dalam survei pengguna Universitas Andalas tahun ini, kami ucapkan terima kasih.",
  links: {
    suratPengantar: "https://uandalas-my.sharepoint.com/personal/usersurvey_unand_ac_id/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fusersurvey%5Funand%5Fac%5Fid%2FDocuments%2FAdministrasi%2FUser%20Survey%5FSurat%20Undangan%20Perusahaan%2Epdf&parent=%2Fpersonal%2Fusersurvey%5Funand%5Fac%5Fid%2FDocuments%2FAdministrasi&ga=1"
  },
  signOff: {
    department: "Pusat Karir, Konseling, dan Tracer Study",
    university: "Universitas Andalas"
  },
}

function UserSurvey() {
  const navigate = useNavigate()

  const handleStartSurvey = () => {
    navigate("/user-survey/login")
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full">
            {/* Grid Layout */}
            <div className="grid lg:grid-cols-5 gap-12 items-stretch">
              {/* Left Section - Title and Image */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                {/* Header */}
                <div className="text-center lg:text-left space-y-6">
  <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
    {userSurveyData.title.split(" ").slice(0, -2).join(" ")}{" "}
    <span className="block">
      {userSurveyData.title.split(" ").slice(-2).join(" ")}
    </span>
  </h1>
</div>


                {/* Gambar Ilustrasi */}
                <div className="items-center">
                  <img 
                    src="/assets/userSurvey.png" 
                    alt="User Survey Illustration"
                    className="w-full h-auto"
                  />
                </div>

                {/* CTA Button - Desktop Only */}
                <div className="hidden lg:flex flex-1 text-center items-center justify-center pb-7">
                  <Button
                    onClick={handleStartSurvey}
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-white hover:rounded-0 text-white hover:text-primary border-2 border-primary transition-all duration-300"
                  >
                    <span>Mulai User Survey</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Right Section - Letter Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Main Content Card */}
                <div className="bg-background border rounded-2xl shadow-xl p-6 space-y-6">
                  {/* Greeting */}
                  <div className="text-center space-y-4">
                    <p className="text-lg font-medium text-foreground">
                      {userSurveyData.greeting.islamic}
                    </p>
                    <p className="text-lg font-medium text-foreground">
                      {userSurveyData.greeting.general}
                    </p>
                  </div>

                  {/* Letter Content */}
                  <div className="space-y-2 text-foreground leading-relaxed text-sm">
                    {userSurveyData.content.map((paragraph, index) => (
                      <p key={index} className={paragraph === "" ? "h-2" : ""}>
                        {paragraph.includes("Surat Pengantar:") ? (
                          <>
                            Surat Pengantar:{" "}
                            <a 
                              href={userSurveyData.links.suratPengantar}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 underline hover:no-underline transition-colors"
                            >
                              Pengantar Rektor DUDI 2024
                            </a>
                          </>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Closing */}
                  <div className="space-y-2">
                    <p className="text-foreground leading-relaxed text-sm">
                      {userSurveyData.closing}
                    </p>
                  </div>

                 {/* Sign Off */}
                 <div className="text-center space-y-1 pt-2">
                    <p className="text-sm font-semibold text-foreground">
                      {userSurveyData.signOff.department}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {userSurveyData.signOff.university}
                    </p>
                  </div>

                </div>

                {/* CTA Button - Mobile Only */}
                <div className="lg:hidden text-center py-8">
                  <Button
                    onClick={handleStartSurvey}
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-white hover:rounded-0 text-white hover:text-primary border-2 border-primary transition-all duration-300"
                  >
                    <span>Mulai User Survey</span>
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

export default UserSurvey

import { Layout } from "@/components/layout/Layout"
import { ChevronDown, HelpCircle, Mail, Phone } from "lucide-react"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Apa itu Tracer Study?",
    answer: "Tracer Study adalah survei yang dilakukan untuk melacak perjalanan karier alumni setelah lulus dari universitas. Survei ini membantu mengukur Indikator Kinerja Utama (IKU) perguruan tinggi sesuai dengan program Merdeka Belajar Kemendikbudristek."
  },
  {
    question: "Siapa yang harus mengisi Tracer Study?",
    answer: "Tracer Study ditujukan untuk semua lulusan Universitas Andalas tahun 2023, mulai dari program D3, S1, dan program profesi dokter/gigi. Partisipasi semua alumni sangat diharapkan untuk mendapatkan data yang komprehensif."
  },
  {
    question: "Berapa lama waktu yang dibutuhkan untuk mengisi survei?",
    answer: "Waktu pengerjaan survei bervariasi tergantung jenis survei. Tracer Study membutuhkan waktu sekitar 15-20 menit, sedangkan User Survey membutuhkan waktu sekitar 10-15 menit. Semua pertanyaan dapat diisi secara bertahap dan disimpan sementara."
  },
  {
    question: "Apakah data saya aman dan rahasia?",
    answer: "Ya, data dan identitas Anda akan dijaga kerahasiaannya. Semua informasi yang Anda berikan hanya akan digunakan untuk keperluan evaluasi internal dan peningkatan kualitas pendidikan. Data tidak akan disebarluaskan kepada pihak ketiga tanpa persetujuan Anda."
  },
  {
    question: "Bagaimana cara mengisi survei?",
    answer: "Anda dapat mengisi survei dengan mengklik tombol 'Mulai Tracer Study' atau 'User Survey' di halaman utama. Ikuti petunjuk yang diberikan dan isi semua pertanyaan yang wajib diisi. Pastikan koneksi internet Anda stabil selama mengisi survei."
  },
  {
    question: "Apakah survei ini wajib diisi?",
    answer: "Meskipun tidak wajib secara hukum, partisipasi Anda sangat diharapkan untuk membantu universitas mengumpulkan data yang diperlukan untuk evaluasi dan peningkatan kualitas pendidikan. Data ini juga penting untuk peringkat perguruan tinggi nasional."
  },
  {
    question: "Bagaimana jika saya mengalami kendala teknis?",
    answer: "Jika Anda mengalami kendala teknis, silakan hubungi tim support melalui email karir@unand.ac.id atau telepon 085161476546. Tim kami siap membantu Anda mengatasi masalah yang dihadapi."
  },
  {
    question: "Kapan survei ini berakhir?",
    answer: "Tracer Study untuk lulusan 2023 akan berlangsung sepanjang tahun 2024. Namun, kami menyarankan untuk mengisi survei sesegera mungkin agar data dapat segera diproses dan dianalisis untuk keperluan evaluasi."
  }
]

function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                <HelpCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground">
                Pertanyaan yang sering diajukan tentang Tracer Study & User Survey
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="bg-background border rounded-xl shadow-sm">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-foreground pr-4">
                      {item.question}
                    </h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Masih Ada Pertanyaan?
                </h2>
                <p className="text-muted-foreground">
                  Tim support kami siap membantu menjawab pertanyaan Anda
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Telepon</p>
                      <a 
                        href="tel:085161476546"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        085161476546
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a 
                        href="mailto:karir@unand.ac.id"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        karir@unand.ac.id
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FAQ

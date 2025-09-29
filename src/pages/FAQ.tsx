import { Layout } from "@/components/layout/Layout"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

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
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full">
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

            {/* FAQ Items - 2 Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqData.slice(0, Math.ceil(faqData.length / 2)).map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-background border rounded-xl shadow-sm">
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                        <h3 className="text-sm font-semibold text-foreground pr-4">
                          {item.question}
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqData.slice(Math.ceil(faqData.length / 2)).map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + Math.ceil(faqData.length / 2)}`} className="bg-background border rounded-xl shadow-sm">
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                        <h3 className="text-sm font-semibold text-foreground pr-4">
                          {item.question}
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FAQ

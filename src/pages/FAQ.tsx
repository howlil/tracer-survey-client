import { Layout } from "@/components/layout/Layout"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import { useFAQsPublic } from "@/api/faq.api"

interface FAQItem {
  question: string
  answer: string
}

function FAQ() {
  const { data: faqs = [], isLoading } = useFAQsPublic()

  // Convert API data to FAQItem format
  const faqData: FAQItem[] = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }))

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Memuat FAQ...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (faqData.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Belum ada FAQ tersedia</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
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

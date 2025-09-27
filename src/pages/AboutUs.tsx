import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Heart, Mail, MapPin, Phone, Target, Users } from "lucide-react"

function AboutUs() {
  const handleContact = () => {
    console.log("Contact us...")
    // TODO: Navigate to contact form or open contact modal
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-6 mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Tentang Kami
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Pusat Karir, Konseling, dan Tracer Study Universitas Andalas
              </p>
            </div>

            {/* Mission Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Misi Kami
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Sebagai bagian dari Universitas Andalas, kami berkomitmen untuk mendukung program Merdeka Belajar 
                  Kemendikbudristek melalui pengumpulan data tracer study dan survei pengguna yang komprehensif.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Kami percaya bahwa data yang akurat dan terpercaya adalah kunci untuk meningkatkan kualitas pendidikan 
                  dan layanan di perguruan tinggi. Melalui platform ini, kami memfasilitasi pengumpulan data yang 
                  efisien dan terstruktur.
                </p>
                <Button onClick={handleContact} className="mt-4">
                  Hubungi Kami
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-background border rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">10K+ Alumni</h3>
                  <p className="text-sm text-muted-foreground">Data alumni terlacak</p>
                </div>
                
                <div className="bg-background border rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">95% Response</h3>
                  <p className="text-sm text-muted-foreground">Tingkat partisipasi</p>
                </div>
                
                <div className="bg-background border rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">8 IKU</h3>
                  <p className="text-sm text-muted-foreground">Indikator diukur</p>
                </div>
                
                <div className="bg-background border rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">100%</h3>
                  <p className="text-sm text-muted-foreground">Dedikasi tim</p>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-background border rounded-2xl p-8 md:p-12 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Nilai-Nilai Kami
                </h2>
                <p className="text-lg text-muted-foreground">
                  Prinsip yang menjadi landasan dalam setiap aktivitas kami
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Integritas</h3>
                  <p className="text-muted-foreground">
                    Kami menjaga kejujuran dan transparansi dalam setiap proses pengumpulan dan pengolahan data
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Kualitas</h3>
                  <p className="text-muted-foreground">
                    Kami berkomitmen untuk menghasilkan data berkualitas tinggi yang dapat diandalkan untuk pengambilan keputusan
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Inovasi</h3>
                  <p className="text-muted-foreground">
                    Kami terus berinovasi dalam metode dan teknologi untuk meningkatkan efektivitas pengumpulan data
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Hubungi Kami
                </h2>
                <p className="text-muted-foreground">
                  Tim kami siap membantu Anda dengan pertanyaan atau kebutuhan terkait tracer study dan survei
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Alamat</p>
                      <p className="font-medium text-foreground">
                        Kampus Universitas Andalas<br />
                        Limau Manis, Padang<br />
                        Sumatera Barat 25163
                      </p>
                    </div>
                  </div>
                  
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

export default AboutUs

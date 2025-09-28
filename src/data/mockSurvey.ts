import type { Question } from "@/types/survey"

export const mockSurveyQuestions: Question[] = [
  // Text Questions
  {
    id: "nama",
    type: "text",
    label: "Nama Lengkap",
    required: true,
    placeholder: "Masukkan nama lengkap Anda",
    inputType: "text"
  },
  {
    id: "email",
    type: "text",
    label: "Alamat Email",
    required: true,
    placeholder: "contoh@email.com",
    inputType: "email"
  },
  {
    id: "telepon",
    type: "text",
    label: "Nomor Telepon",
    required: false,
    placeholder: "08xxxxxxxxxx",
    inputType: "tel"
  },

  // Single Choice Questions
  {
    id: "jenis_kelamin",
    type: "single",
    label: "Jenis Kelamin",
    required: true,
    options: [
      { value: "laki-laki", label: "Laki-laki" },
      { value: "perempuan", label: "Perempuan" }
    ],
    layout: "horizontal"
  },
  {
    id: "status_pernikahan",
    type: "single",
    label: "Status Pernikahan",
    required: true,
    options: [
      { value: "belum-menikah", label: "Belum Menikah" },
      { value: "menikah", label: "Menikah" },
      { value: "cerai", label: "Cerai" },
      { value: "lainnya", label: "Lainnya", isOther: true }
    ],
    layout: "vertical",
    otherInputPlaceholder: "Sebutkan status lainnya...",
    validateOther: true
  },

  // Multiple Choice Questions
  {
    id: "hobi",
    type: "multiple",
    label: "Hobi yang Dimiliki",
    required: false,
    options: [
      { value: "olahraga", label: "Olahraga" },
      { value: "membaca", label: "Membaca" },
      { value: "musik", label: "Musik" },
      { value: "travelling", label: "Travelling" },
      { value: "gaming", label: "Gaming" },
      { value: "lainnya", label: "Lainnya", isOther: true }
    ],
    layout: "horizontal",
    otherInputPlaceholder: "Sebutkan hobi lainnya...",
    validateOther: true
  },
  {
    id: "skill_programming",
    type: "multiple",
    label: "Skill Programming yang Dikuasai",
    required: true,
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "php", label: "PHP" },
      { value: "golang", label: "Go" },
      { value: "rust", label: "Rust" }
    ],
    layout: "vertical"
  },

  // ComboBox Questions
  {
    id: "provinsi",
    type: "combobox",
    label: "Provinsi",
    required: true,
    comboboxItems: [
      {
        id: "provinsi",
        label: "Pilih Provinsi",
        placeholder: "Pilih provinsi tempat tinggal",
        searchPlaceholder: "Cari provinsi...",
        required: true,
        options: [
          { value: "aceh", label: "Aceh" },
          { value: "sumatera-utara", label: "Sumatera Utara" },
          { value: "sumatera-barat", label: "Sumatera Barat" },
          { value: "riau", label: "Riau" },
          { value: "kepulauan-riau", label: "Kepulauan Riau" },
          { value: "jambi", label: "Jambi" },
          { value: "sumatera-selatan", label: "Sumatera Selatan" },
          { value: "bangka-belitung", label: "Bangka Belitung" },
          { value: "bengkulu", label: "Bengkulu" },
          { value: "lampung", label: "Lampung" },
          { value: "dki-jakarta", label: "DKI Jakarta" },
          { value: "jawa-barat", label: "Jawa Barat" },
          { value: "jawa-tengah", label: "Jawa Tengah" },
          { value: "di-yogyakarta", label: "DI Yogyakarta" },
          { value: "jawa-timur", label: "Jawa Timur" },
          { value: "banten", label: "Banten" },
          { value: "bali", label: "Bali" },
          { value: "nusa-tenggara-barat", label: "Nusa Tenggara Barat" },
          { value: "nusa-tenggara-timur", label: "Nusa Tenggara Timur" },
          { value: "kalimantan-barat", label: "Kalimantan Barat" },
          { value: "kalimantan-tengah", label: "Kalimantan Tengah" },
          { value: "kalimantan-selatan", label: "Kalimantan Selatan" },
          { value: "kalimantan-timur", label: "Kalimantan Timur" },
          { value: "kalimantan-utara", label: "Kalimantan Utara" },
          { value: "sulawesi-utara", label: "Sulawesi Utara" },
          { value: "sulawesi-tengah", label: "Sulawesi Tengah" },
          { value: "sulawesi-selatan", label: "Sulawesi Selatan" },
          { value: "sulawesi-tenggara", label: "Sulawesi Tenggara" },
          { value: "gorontalo", label: "Gorontalo" },
          { value: "sulawesi-barat", label: "Sulawesi Barat" },
          { value: "maluku", label: "Maluku" },
          { value: "maluku-utara", label: "Maluku Utara" },
          { value: "papua", label: "Papua" },
          { value: "papua-barat", label: "Papua Barat" }
        ]
      }
    ]
  },
  {
    id: "kabupaten",
    type: "combobox",
    label: "Kabupaten/Kota",
    required: true,
    comboboxItems: [
      {
        id: "kabupaten",
        label: "Pilih Kabupaten/Kota",
        placeholder: "Pilih kabupaten/kota",
        searchPlaceholder: "Cari kabupaten/kota...",
        required: true,
        options: [
          { value: "padang", label: "Kota Padang" },
          { value: "bukittinggi", label: "Kota Bukittinggi" },
          { value: "payakumbuh", label: "Kota Payakumbuh" },
          { value: "sawahlunto", label: "Kota Sawahlunto" },
          { value: "solok", label: "Kota Solok" },
          { value: "padang-panjang", label: "Kota Padang Panjang" },
          { value: "pariaman", label: "Kota Pariaman" },
          { value: "padang-sidempuan", label: "Kota Padang Sidempuan" },
          { value: "sibolga", label: "Kota Sibolga" },
          { value: "medan", label: "Kota Medan" },
          { value: "binjai", label: "Kota Binjai" },
          { value: "pematang-siantar", label: "Kota Pematang Siantar" },
          { value: "tebing-tinggi", label: "Kota Tebing Tinggi" },
          { value: "tanjung-balai", label: "Kota Tanjung Balai" },
          { value: "kisaran", label: "Kota Kisaran" },
          { value: "gunung-sitoli", label: "Kota Gunung Sitoli" },
          { value: "tarutung", label: "Kota Tarutung" },
          { value: "pandan", label: "Kota Pandan" },
          { value: "ranai", label: "Kota Ranai" }
        ]
      }
    ]
  },

  // Rating Questions
  {
    id: "kepuasan_kerja",
    type: "rating",
    label: "Tingkat Kepuasan Kerja",
    required: true,
    ratingItems: [
      { id: "gaji", label: "Gaji yang diterima" },
      { id: "lingkungan", label: "Lingkungan kerja" },
      { id: "atasan", label: "Hubungan dengan atasan" },
      { id: "rekan", label: "Hubungan dengan rekan kerja" },
      { id: "fasilitas", label: "Fasilitas yang disediakan" },
      { id: "kesempatan", label: "Kesempatan pengembangan karir" },
      { id: "jam_kerja", label: "Jam kerja" },
      { id: "tanggung_jawab", label: "Tingkat tanggung jawab" }
    ],
    ratingOptions: [
      { value: "sangat-tidak-puas", label: "Sangat Tidak Puas" },
      { value: "tidak-puas", label: "Tidak Puas" },
      { value: "netral", label: "Netral" },
      { value: "puas", label: "Puas" },
      { value: "sangat-puas", label: "Sangat Puas" }
    ]
  },
  {
    id: "keterampilan_akademik",
    type: "rating",
    label: "Penilaian Keterampilan yang Didapat dari Akademik",
    required: true,
    ratingItems: [
      { id: "komunikasi", label: "Keterampilan Komunikasi" },
      { id: "analisis", label: "Keterampilan Analisis" },
      { id: "kritis", label: "Berpikir Kritis" },
      { id: "kreatif", label: "Berpikir Kreatif" },
      { id: "kolaborasi", label: "Keterampilan Kolaborasi" },
      { id: "kepemimpinan", label: "Kepemimpinan" },
      { id: "teknologi", label: "Penguasaan Teknologi" },
      { id: "bahasa", label: "Keterampilan Bahasa Asing" }
    ],
    ratingOptions: [
      { value: "sangat-buruk", label: "Sangat Buruk" },
      { value: "buruk", label: "Buruk" },
      { value: "cukup", label: "Cukup" },
      { value: "baik", label: "Baik" },
      { value: "sangat-baik", label: "Sangat Baik" }
    ]
  }
]

// Sample answers for testing
export const mockSurveyAnswers = {
  nama: "John Doe",
  email: "john.doe@example.com",
  telepon: "081234567890",
  jenis_kelamin: "laki-laki",
  status_pernikahan: "belum-menikah",
  hobi: ["olahraga", "membaca", "musik"],
  skill_programming: ["javascript", "typescript", "python"],
  provinsi: "sumatera-barat",
  kabupaten: "padang",
  kepuasan_kerja: {
    gaji: "puas",
    lingkungan: "sangat-puas",
    atasan: "puas",
    rekan: "sangat-puas",
    fasilitas: "netral",
    kesempatan: "puas",
    jam_kerja: "puas",
    tanggung_jawab: "sangat-puas"
  },
  keterampilan_akademik: {
    komunikasi: "baik",
    analisis: "sangat-baik",
    kritis: "baik",
    kreatif: "cukup",
    kolaborasi: "baik",
    kepemimpinan: "cukup",
    teknologi: "sangat-baik",
    bahasa: "baik"
  }
}

import { Question } from "@/types/survey"

// Tracer Study Survey Data
export const tracerStudyQuestions: Question[] = [
  // Page 1 - Data Pribadi
  {
    id: "nama_lengkap",
    type: "text",
    label: "Nama Lengkap",
    required: true,
    placeholder: "Masukkan nama lengkap sesuai ijazah",
    inputType: "text"
  },
  {
    id: "nim",
    type: "text",
    label: "NIM (Nomor Induk Mahasiswa)",
    required: true,
    placeholder: "Masukkan NIM Anda",
    inputType: "text"
  },
  {
    id: "program_studi",
    type: "text",
    label: "Program Studi",
    required: true,
    placeholder: "Masukkan program studi Anda",
    inputType: "text"
  },
  {
    id: "tahun_lulus",
    type: "text",
    label: "Tahun Lulus",
    required: true,
    placeholder: "Contoh: 2023",
    inputType: "number"
  },
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

  // Page 2 - Kontak
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
    label: "Nomor Telepon/WhatsApp",
    required: true,
    placeholder: "08xxxxxxxxxx",
    inputType: "tel"
  },
  {
    id: "alamat_tinggal",
    type: "text",
    label: "Alamat Tempat Tinggal Saat Ini",
    required: true,
    placeholder: "Masukkan alamat lengkap tempat tinggal",
    inputType: "text"
  },
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

  // Page 3 - Status Kerja
  {
    id: "status_kerja",
    type: "single",
    label: "Status Kerja Saat Ini",
    required: true,
    options: [
      { value: "bekerja", label: "Bekerja" },
      { value: "tidak-bekerja", label: "Tidak Bekerja" },
      { value: "melanjutkan-studi", label: "Melanjutkan Studi" },
      { value: "wirausaha", label: "Wirausaha" },
      { value: "lainnya", label: "Lainnya", isOther: true }
    ],
    layout: "vertical",
    otherInputPlaceholder: "Sebutkan status lainnya...",
    validateOther: true
  },
  {
    id: "bidang_kerja",
    type: "text",
    label: "Bidang Kerja/Usaha",
    required: false,
    placeholder: "Contoh: Teknologi Informasi, Pendidikan, dll",
    inputType: "text"
  },
  {
    id: "nama_perusahaan",
    type: "text",
    label: "Nama Perusahaan/Instansi",
    required: false,
    placeholder: "Masukkan nama perusahaan atau instansi",
    inputType: "text"
  },
  {
    id: "jabatan",
    type: "text",
    label: "Jabatan/Posisi",
    required: false,
    placeholder: "Masukkan jabatan atau posisi Anda",
    inputType: "text"
  },

  // Page 4 - Penilaian Kompetensi
  {
    id: "penilaian_kompetensi",
    type: "rating",
    label: "Penilaian Kompetensi yang Didapat dari Perguruan Tinggi",
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
  },

  // Page 5 - Kepuasan Pendidikan
  {
    id: "kepuasan_pendidikan",
    type: "rating",
    label: "Tingkat Kepuasan terhadap Pendidikan di Perguruan Tinggi",
    required: true,
    ratingItems: [
      { id: "kurikulum", label: "Kurikulum" },
      { id: "dosen", label: "Kualitas Dosen" },
      { id: "fasilitas", label: "Fasilitas Pembelajaran" },
      { id: "praktikum", label: "Kegiatan Praktikum" },
      { id: "penelitian", label: "Kegiatan Penelitian" },
      { id: "pengabdian", label: "Kegiatan Pengabdian Masyarakat" },
      { id: "administrasi", label: "Pelayanan Administrasi" },
      { id: "perpustakaan", label: "Fasilitas Perpustakaan" }
    ],
    ratingOptions: [
      { value: "sangat-tidak-puas", label: "Sangat Tidak Puas" },
      { value: "tidak-puas", label: "Tidak Puas" },
      { value: "netral", label: "Netral" },
      { value: "puas", label: "Puas" },
      { value: "sangat-puas", label: "Sangat Puas" }
    ]
  },

  // Page 6 - Saran dan Harapan
  {
    id: "saran_perbaikan",
    type: "text",
    label: "Saran untuk Perbaikan Program Studi",
    required: false,
    placeholder: "Berikan saran untuk perbaikan program studi Anda...",
    inputType: "text"
  },
  {
    id: "harapan_masa_depan",
    type: "text",
    label: "Harapan untuk Masa Depan Program Studi",
    required: false,
    placeholder: "Berikan harapan untuk masa depan program studi...",
    inputType: "text"
  }
]

// Page configuration - berapa banyak pertanyaan per halaman
export const tracerStudyPages = [
  {
    page: 1,
    title: "Data Pribadi",
    description: "Informasi dasar tentang diri Anda",
    questionIds: ["nama_lengkap", "nim", "program_studi", "tahun_lulus", "jenis_kelamin"]
  },
  {
    page: 2,
    title: "Informasi Kontak",
    description: "Data kontak dan alamat tempat tinggal",
    questionIds: ["email", "telepon", "alamat_tinggal", "provinsi"]
  },
  {
    page: 3,
    title: "Status Kerja",
    description: "Informasi tentang status kerja saat ini",
    questionIds: ["status_kerja", "bidang_kerja", "nama_perusahaan", "jabatan"]
  },
  {
    page: 4,
    title: "Penilaian Kompetensi",
    description: "Penilaian kompetensi yang didapat dari perguruan tinggi",
    questionIds: ["penilaian_kompetensi"]
  },
  {
    page: 5,
    title: "Kepuasan Pendidikan",
    description: "Tingkat kepuasan terhadap pendidikan di perguruan tinggi",
    questionIds: ["kepuasan_pendidikan"]
  },
  {
    page: 6,
    title: "Saran dan Harapan",
    description: "Saran dan harapan untuk program studi",
    questionIds: ["saran_perbaikan", "harapan_masa_depan"]
  }
]

// Survey metadata
export const tracerStudyMetadata = {
  id: "tracer-study-2024",
  title: "Tracer Study Universitas Andalas",
  description: "Survei untuk lulusan Universitas Andalas",
  totalPages: tracerStudyPages.length,
  estimatedTime: "15-20 menit"
}

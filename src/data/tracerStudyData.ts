import type { Question, ConditionalQuestion } from "@/types/survey"

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
      { value: "bekerja", label: "Bekerja", isTrigger: true },
      { value: "tidak-bekerja", label: "Tidak Bekerja", isTrigger: true },
      { value: "melanjutkan-studi", label: "Melanjutkan Studi", isTrigger: true },
      { value: "wirausaha", label: "Wirausaha", isTrigger: true },
      { value: "lainnya", label: "Lainnya", isOther: true, isTrigger: true }
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

// Conditional Questions untuk Tracer Study
export const tracerStudyConditionalQuestions: ConditionalQuestion[] = [
  // Conditional questions untuk yang BEKERJA
  {
    id: "cq_bekerja_1",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "bekerja",
    question: {
      id: "lama_bekerja",
      type: "single",
      label: "Berapa lama Anda sudah bekerja?",
      required: true,
      options: [
        { value: "kurang-1-tahun", label: "Kurang dari 1 tahun" },
        { value: "1-2-tahun", label: "1-2 tahun" },
        { value: "2-3-tahun", label: "2-3 tahun" },
        { value: "3-5-tahun", label: "3-5 tahun" },
        { value: "lebih-5-tahun", label: "Lebih dari 5 tahun" }
      ],
      layout: "vertical"
    }
  },
  {
    id: "cq_bekerja_2",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "bekerja",
    question: {
      id: "gaji_pertama",
      type: "single",
      label: "Berapa gaji pertama yang Anda terima?",
      required: true,
      options: [
        { value: "kurang-3jt", label: "Kurang dari 3 juta" },
        { value: "3-5jt", label: "3-5 juta" },
        { value: "5-8jt", label: "5-8 juta" },
        { value: "8-12jt", label: "8-12 juta" },
        { value: "lebih-12jt", label: "Lebih dari 12 juta" }
      ],
      layout: "vertical"
    }
  },
  {
    id: "cq_bekerja_3",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "bekerja",
    question: {
      id: "relevansi_pekerjaan",
      type: "single",
      label: "Seberapa relevan pekerjaan Anda dengan bidang studi?",
      required: true,
      options: [
        { value: "sangat-relevan", label: "Sangat Relevan" },
        { value: "relevan", label: "Relevan" },
        { value: "cukup-relevan", label: "Cukup Relevan" },
        { value: "kurang-relevan", label: "Kurang Relevan" },
        { value: "tidak-relevan", label: "Tidak Relevan" }
      ],
      layout: "vertical"
    }
  },

  // Conditional questions untuk yang TIDAK BEKERJA
  {
    id: "cq_tidak_bekerja_1",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "tidak-bekerja",
    question: {
      id: "alasan_tidak_bekerja",
      type: "single",
      label: "Mengapa Anda belum bekerja?",
      required: true,
      options: [
        { value: "masih-mencari", label: "Masih mencari pekerjaan" },
        { value: "menunggu-panggilan", label: "Menunggu panggilan kerja" },
        { value: "fokus-keluarga", label: "Fokus pada keluarga" },
        { value: "kesehatan", label: "Alasan kesehatan" },
        { value: "lainnya", label: "Lainnya", isOther: true }
      ],
      layout: "vertical",
      otherInputPlaceholder: "Sebutkan alasan lainnya...",
      validateOther: true
    }
  },
  {
    id: "cq_tidak_bekerja_2",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "tidak-bekerja",
    question: {
      id: "rencana_kerja",
      type: "single",
      label: "Apakah Anda berencana mencari pekerjaan?",
      required: true,
      options: [
        { value: "ya-segera", label: "Ya, dalam waktu dekat" },
        { value: "ya-nanti", label: "Ya, tapi tidak dalam waktu dekat" },
        { value: "tidak", label: "Tidak berencana" }
      ],
      layout: "vertical"
    }
  },

  // Conditional questions untuk yang MELANJUTKAN STUDI
  {
    id: "cq_studi_1",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "melanjutkan-studi",
    question: {
      id: "jenjang_studi",
      type: "single",
      label: "Jenjang studi yang sedang ditempuh?",
      required: true,
      options: [
        { value: "s2", label: "S2 (Magister)" },
        { value: "s3", label: "S3 (Doktor)" },
        { value: "profesi", label: "Program Profesi" },
        { value: "lainnya", label: "Lainnya", isOther: true }
      ],
      layout: "vertical",
      otherInputPlaceholder: "Sebutkan jenjang lainnya...",
      validateOther: true
    }
  },
  {
    id: "cq_studi_2",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "melanjutkan-studi",
    question: {
      id: "universitas_studi",
      type: "text",
      label: "Di universitas mana Anda melanjutkan studi?",
      required: true,
      placeholder: "Masukkan nama universitas",
      inputType: "text"
    }
  },
  {
    id: "cq_studi_3",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "melanjutkan-studi",
    question: {
      id: "program_studi_lanjutan",
      type: "text",
      label: "Program studi yang sedang ditempuh?",
      required: true,
      placeholder: "Masukkan program studi",
      inputType: "text"
    }
  },

  // Conditional questions untuk yang WIRAUSAHA
  {
    id: "cq_wirausaha_1",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "wirausaha",
    question: {
      id: "jenis_usaha",
      type: "text",
      label: "Jenis usaha yang dijalankan?",
      required: true,
      placeholder: "Contoh: Toko online, warung makan, dll",
      inputType: "text"
    }
  },
  {
    id: "cq_wirausaha_2",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "wirausaha",
    question: {
      id: "omset_usaha",
      type: "single",
      label: "Berapa omset usaha per bulan?",
      required: true,
      options: [
        { value: "kurang-5jt", label: "Kurang dari 5 juta" },
        { value: "5-10jt", label: "5-10 juta" },
        { value: "10-25jt", label: "10-25 juta" },
        { value: "25-50jt", label: "25-50 juta" },
        { value: "lebih-50jt", label: "Lebih dari 50 juta" }
      ],
      layout: "vertical"
    }
  },
  {
    id: "cq_wirausaha_3",
    triggerQuestionId: "status_kerja",
    triggerOptionValue: "wirausaha",
    question: {
      id: "jumlah_karyawan",
      type: "single",
      label: "Berapa jumlah karyawan?",
      required: true,
      options: [
        { value: "sendiri", label: "Sendiri" },
        { value: "2-5-orang", label: "2-5 orang" },
        { value: "6-10-orang", label: "6-10 orang" },
        { value: "11-25-orang", label: "11-25 orang" },
        { value: "lebih-25-orang", label: "Lebih dari 25 orang" }
      ],
      layout: "vertical"
    }
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

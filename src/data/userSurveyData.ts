import type { Question, ConditionalQuestion } from '@/types/survey'

// User Survey Metadata
export const userSurveyMetadata = {
  id: 'user-survey-2025',
  title: 'User Survey Universitas Andalas 2025',
  description: 'Survei kepuasan pengguna untuk meningkatkan kualitas layanan dan fasilitas',
  totalPages: 4,
  estimatedTime: '15-20 menit'
}

// User Survey Pages
export const userSurveyPages = [
  {
    page: 1,
    title: 'Data Perusahaan',
    description: 'Informasi dasar tentang perusahaan tempat Anda bekerja',
    questionIds: ['q1', 'q2', 'q3', 'q4']
  },
  {
    page: 2,
    title: 'Penilaian Kompetensi',
    description: 'Penilaian kompetensi lulusan Universitas Andalas',
    questionIds: ['q5', 'q6', 'q7', 'q8']
  },
  {
    page: 3,
    title: 'Kepuasan Kerja',
    description: 'Tingkat kepuasan terhadap kinerja lulusan',
    questionIds: ['q9', 'q10', 'q11', 'q12']
  },
  {
    page: 4,
    title: 'Saran dan Harapan',
    description: 'Saran dan harapan untuk pengembangan lulusan',
    questionIds: ['q13', 'q14', 'q15']
  }
]

// User Survey Questions
export const userSurveyQuestions: Question[] = [
  // Page 1: Data Perusahaan
  {
    id: 'q1',
    type: 'text',
    label: 'Nama Perusahaan/Instansi',
    required: true,
    placeholder: 'Masukkan nama perusahaan atau instansi tempat Anda bekerja'
  },
  {
    id: 'q2',
    type: 'text',
    label: 'Jabatan/Posisi',
    required: true,
    placeholder: 'Masukkan jabatan atau posisi Anda di perusahaan'
  },
  {
    id: 'q3',
    type: 'single',
    label: 'Bidang Industri',
    required: true,
    options: [
      { value: 'teknologi', label: 'Teknologi Informasi' },
      { value: 'kesehatan', label: 'Kesehatan' },
      { value: 'pendidikan', label: 'Pendidikan' },
      { value: 'keuangan', label: 'Keuangan & Perbankan' },
      { value: 'pemerintahan', label: 'Pemerintahan' },
      { value: 'manufaktur', label: 'Manufaktur' },
      { value: 'pertanian', label: 'Pertanian' },
      { value: 'lainnya', label: 'Lainnya', isOther: true }
    ],
    otherInputPlaceholder: 'Sebutkan bidang industri lainnya'
  },
  {
    id: 'q4',
    type: 'single',
    label: 'Ukuran Perusahaan',
    required: true,
    options: [
      { value: 'kecil', label: 'Kecil (1-50 karyawan)' },
      { value: 'menengah', label: 'Menengah (51-250 karyawan)' },
      { value: 'besar', label: 'Besar (251-1000 karyawan)' },
      { value: 'sangat-besar', label: 'Sangat Besar (>1000 karyawan)' }
    ]
  },

  // Page 2: Penilaian Kompetensi
  {
    id: 'q5',
    type: 'rating',
    label: 'Penilaian Kompetensi Lulusan',
    required: true,
    ratingItems: [
      { id: 'kompetensi-teknis', label: 'Kompetensi Teknis' },
      { id: 'komunikasi', label: 'Kemampuan Komunikasi' },
      { id: 'kerjasama', label: 'Kemampuan Kerjasama Tim' },
      { id: 'kepemimpinan', label: 'Kemampuan Kepemimpinan' },
      { id: 'adaptasi', label: 'Kemampuan Beradaptasi' },
      { id: 'etika', label: 'Etika Profesi' }
    ],
    ratingOptions: [
      { value: '1', label: 'Sangat Kurang' },
      { value: '2', label: 'Kurang' },
      { value: '3', label: 'Cukup' },
      { value: '4', label: 'Baik' },
      { value: '5', label: 'Sangat Baik' }
    ]
  },
  {
    id: 'q6',
    type: 'single',
    label: 'Kemampuan yang Paling Menonjol',
    required: true,
    options: [
      { value: 'analisis', label: 'Kemampuan Analisis' },
      { value: 'kreativitas', label: 'Kreativitas' },
      { value: 'problem-solving', label: 'Problem Solving' },
      { value: 'komunikasi', label: 'Komunikasi' },
      { value: 'kepemimpinan', label: 'Kepemimpinan' },
      { value: 'lainnya', label: 'Lainnya', isOther: true }
    ],
    otherInputPlaceholder: 'Sebutkan kemampuan lainnya'
  },
  {
    id: 'q7',
    type: 'multiple',
    label: 'Area yang Perlu Ditingkatkan',
    required: true,
    options: [
      { value: 'soft-skills', label: 'Soft Skills' },
      { value: 'hard-skills', label: 'Hard Skills' },
      { value: 'komunikasi', label: 'Komunikasi' },
      { value: 'kepemimpinan', label: 'Kepemimpinan' },
      { value: 'adaptasi', label: 'Adaptasi Teknologi' },
      { value: 'etika', label: 'Etika Profesi' },
      { value: 'lainnya', label: 'Lainnya', isOther: true }
    ],
    otherInputPlaceholder: 'Sebutkan area lainnya'
  },
  {
    id: 'q8',
    type: 'single',
    label: 'Tingkat Kesiapan Kerja',
    required: true,
    options: [
      { value: 'sangat-siap', label: 'Sangat Siap' },
      { value: 'siap', label: 'Siap' },
      { value: 'cukup-siap', label: 'Cukup Siap' },
      { value: 'kurang-siap', label: 'Kurang Siap' },
      { value: 'tidak-siap', label: 'Tidak Siap' }
    ]
  },

  // Page 3: Kepuasan Kerja
  {
    id: 'q9',
    type: 'rating',
    label: 'Tingkat Kepuasan Terhadap Lulusan',
    required: true,
    ratingItems: [
      { id: 'kinerja-kerja', label: 'Kinerja Kerja' },
      { id: 'inisiatif', label: 'Inisiatif' },
      { id: 'disiplin', label: 'Disiplin' },
      { id: 'kreativitas', label: 'Kreativitas' },
      { id: 'loyalitas', label: 'Loyalitas' },
      { id: 'profesionalisme', label: 'Profesionalisme' }
    ],
    ratingOptions: [
      { value: '1', label: 'Sangat Tidak Puas' },
      { value: '2', label: 'Tidak Puas' },
      { value: '3', label: 'Netral' },
      { value: '4', label: 'Puas' },
      { value: '5', label: 'Sangat Puas' }
    ]
  },
  {
    id: 'q10',
    type: 'single',
    label: 'Apakah Akan Merekrut Lulusan Unand Lagi?',
    required: true,
    options: [
      { value: 'ya-pasti', label: 'Ya, Pasti', isTrigger: true },
      { value: 'ya-mungkin', label: 'Ya, Mungkin', isTrigger: true },
      { value: 'netral', label: 'Netral', isTrigger: true },
      { value: 'tidak-mungkin', label: 'Tidak Mungkin', isTrigger: true },
      { value: 'tidak-pasti', label: 'Tidak Pasti', isTrigger: true }
    ]
  },
  {
    id: 'q11',
    type: 'single',
    label: 'Tingkat Rekomendasi ke Perusahaan Lain',
    required: true,
    options: [
      { value: 'sangat-rekomendasikan', label: 'Sangat Merekomendasikan' },
      { value: 'rekomendasikan', label: 'Merekomendasikan' },
      { value: 'netral', label: 'Netral' },
      { value: 'tidak-rekomendasikan', label: 'Tidak Merekomendasikan' },
      { value: 'sangat-tidak-rekomendasikan', label: 'Sangat Tidak Merekomendasikan' }
    ]
  },
  {
    id: 'q12',
    type: 'textarea',
    label: 'Alasan Utama Merekrut Lulusan Unand',
    required: true,
    placeholder: 'Jelaskan alasan utama mengapa perusahaan merekrut lulusan Unand',
    rows: 3,
    maxLength: 400
  },

  // Page 4: Saran dan Harapan
  {
    id: 'q13',
    type: 'textarea',
    label: 'Saran untuk Peningkatan Kualitas Lulusan',
    required: true,
    placeholder: 'Berikan saran untuk meningkatkan kualitas lulusan Universitas Andalas',
    rows: 4,
    maxLength: 500
  },
  {
    id: 'q14',
    type: 'textarea',
    label: 'Harapan untuk Program Studi',
    required: true,
    placeholder: 'Apa harapan Anda terhadap program studi di Universitas Andalas?',
    rows: 4,
    maxLength: 400
  },
  {
    id: 'q15',
    type: 'textarea',
    label: 'Komentar Tambahan',
    required: false,
    placeholder: 'Komentar atau saran tambahan lainnya',
    rows: 3,
    maxLength: 300
  }
]

// Conditional Questions untuk User Survey
export const userSurveyConditionalQuestions: ConditionalQuestion[] = [
  // Conditional questions untuk yang YA PASTI merekrut lagi
  {
    id: 'cq_ya_pasti_1',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'ya-pasti',
    question: {
      id: 'q_ya_pasti_alasan',
      type: 'textarea',
      label: 'Alasan utama mengapa pasti akan merekrut lulusan Unand lagi?',
      required: true,
      placeholder: 'Jelaskan alasan utama mengapa perusahaan pasti akan merekrut lulusan Unand lagi',
      rows: 3,
      maxLength: 400
    }
  },
  {
    id: 'cq_ya_pasti_2',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'ya-pasti',
    question: {
      id: 'q_ya_pasti_jumlah',
      type: 'single',
      label: 'Berapa jumlah lulusan Unand yang akan direkrut dalam 1 tahun ke depan?',
      required: true,
      options: [
        { value: '1-2', label: '1-2 orang' },
        { value: '3-5', label: '3-5 orang' },
        { value: '6-10', label: '6-10 orang' },
        { value: '11-20', label: '11-20 orang' },
        { value: 'lebih-20', label: 'Lebih dari 20 orang' }
      ],
      layout: 'vertical'
    }
  },

  // Conditional questions untuk yang YA MUNGKIN merekrut lagi
  {
    id: 'cq_ya_mungkin_1',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'ya-mungkin',
    question: {
      id: 'q_ya_mungkin_pertimbangan',
      type: 'multiple',
      label: 'Pertimbangan apa yang mempengaruhi keputusan merekrut lulusan Unand?',
      required: true,
      options: [
        { value: 'kinerja', label: 'Kinerja yang baik' },
        { value: 'kompetensi', label: 'Kompetensi yang sesuai' },
        { value: 'budaya-kerja', label: 'Budaya kerja yang baik' },
        { value: 'kebutuhan-proyek', label: 'Kebutuhan proyek tertentu' },
        { value: 'budget', label: 'Ketersediaan budget' },
        { value: 'lainnya', label: 'Lainnya', isOther: true }
      ],
      otherInputPlaceholder: 'Sebutkan pertimbangan lainnya',
      validateOther: true
    }
  },
  {
    id: 'cq_ya_mungkin_2',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'ya-mungkin',
    question: {
      id: 'q_ya_mungkin_kondisi',
      type: 'textarea',
      label: 'Dalam kondisi seperti apa perusahaan akan merekrut lulusan Unand?',
      required: true,
      placeholder: 'Jelaskan kondisi atau situasi yang memungkinkan perusahaan merekrut lulusan Unand',
      rows: 3,
      maxLength: 350
    }
  },

  // Conditional questions untuk yang NETRAL
  {
    id: 'cq_netral_1',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'netral',
    question: {
      id: 'q_netral_faktor',
      type: 'multiple',
      label: 'Faktor apa yang mempengaruhi keputusan merekrut lulusan Unand?',
      required: true,
      options: [
        { value: 'kebutuhan', label: 'Kebutuhan perusahaan' },
        { value: 'kualitas', label: 'Kualitas lulusan' },
        { value: 'pengalaman', label: 'Pengalaman kerja sebelumnya' },
        { value: 'referensi', label: 'Referensi dari pihak lain' },
        { value: 'budget', label: 'Ketersediaan budget' },
        { value: 'lainnya', label: 'Lainnya', isOther: true }
      ],
      otherInputPlaceholder: 'Sebutkan faktor lainnya',
      validateOther: true
    }
  },

  // Conditional questions untuk yang TIDAK MUNGKIN merekrut lagi
  {
    id: 'cq_tidak_mungkin_1',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'tidak-mungkin',
    question: {
      id: 'q_tidak_mungkin_alasan',
      type: 'multiple',
      label: 'Alasan utama mengapa tidak mungkin merekrut lulusan Unand lagi?',
      required: true,
      options: [
        { value: 'kinerja-buruk', label: 'Kinerja yang kurang memuaskan' },
        { value: 'kompetensi-tidak-sesuai', label: 'Kompetensi tidak sesuai kebutuhan' },
        { value: 'budaya-kerja', label: 'Tidak sesuai budaya kerja perusahaan' },
        { value: 'komunikasi', label: 'Kemampuan komunikasi yang kurang' },
        { value: 'adaptasi', label: 'Kemampuan adaptasi yang rendah' },
        { value: 'lainnya', label: 'Lainnya', isOther: true }
      ],
      otherInputPlaceholder: 'Sebutkan alasan lainnya',
      validateOther: true
    }
  },
  {
    id: 'cq_tidak_mungkin_2',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'tidak-mungkin',
    question: {
      id: 'q_tidak_mungkin_saran',
      type: 'textarea',
      label: 'Saran untuk meningkatkan kualitas lulusan Unand',
      required: true,
      placeholder: 'Berikan saran spesifik untuk meningkatkan kualitas lulusan Unand',
      rows: 4,
      maxLength: 500
    }
  },

  // Conditional questions untuk yang TIDAK PASTI merekrut lagi
  {
    id: 'cq_tidak_pasti_1',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'tidak-pasti',
    question: {
      id: 'q_tidak_pasti_keraguan',
      type: 'multiple',
      label: 'Apa yang membuat perusahaan ragu untuk merekrut lulusan Unand?',
      required: true,
      options: [
        { value: 'konsistensi', label: 'Konsistensi kualitas lulusan' },
        { value: 'kompetensi', label: 'Variasi kompetensi lulusan' },
        { value: 'pengalaman', label: 'Kurangnya pengalaman praktis' },
        { value: 'soft-skills', label: 'Soft skills yang kurang' },
        { value: 'adaptasi', label: 'Kemampuan adaptasi di tempat kerja' },
        { value: 'lainnya', label: 'Lainnya', isOther: true }
      ],
      otherInputPlaceholder: 'Sebutkan keraguan lainnya',
      validateOther: true
    }
  },
  {
    id: 'cq_tidak_pasti_2',
    triggerQuestionId: 'q10',
    triggerOptionValue: 'tidak-pasti',
    question: {
      id: 'q_tidak_pasti_harapan',
      type: 'textarea',
      label: 'Harapan perusahaan terhadap lulusan Unand',
      required: true,
      placeholder: 'Jelaskan harapan perusahaan terhadap kualitas lulusan Unand',
      rows: 4,
      maxLength: 450
    }
  }
]

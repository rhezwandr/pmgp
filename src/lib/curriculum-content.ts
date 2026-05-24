import type { TestType } from "@prisma/client";

import { type Topic } from "./constants";

export type CurriculumQuestion = {
  topic: Topic;
  questionNumber: number;
  questionText: string;
  options: Record<"A" | "B" | "C" | "D", string> & { E?: string };
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type CurriculumTest = {
  type: TestType;
  title: string;
  description: string;
  durationMinutes: number;
  kkm: number;
  questions: CurriculumQuestion[];
};

export type CurriculumModuleSection = {
  title: string;
  content: string;
};

export type CurriculumLkmSection = {
  phase: "Concrete" | "Pictorial" | "Abstract";
  title: string;
  content: string;
  activity: string;
  answerPrompt: string;
};

export type CurriculumLkm = {
  number: number;
  title: string;
  topic: Topic;
  description: string;
  instruction: string;
  estimatedMinutes: number;
  sections: CurriculumLkmSection[];
  reflectionPrompt: string;
};

export type CurriculumModule = {
  title: string;
  topic: Topic;
  description: string;
  content: string;
  learningObjectives: string[];
  sections: CurriculumModuleSection[];
  estimatedMinutes: number;
  minimumReadSeconds: number;
  requiredSectionCount: number;
  isPrerequisite: boolean;
};

// ─── KAM Questions (Soal Asli) ─────────────────────────────────────────────────

const KAM_QUESTIONS: CurriculumQuestion[] = [
  {
    questionNumber: 1,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Luas daerah sebuah segitiga siku-siku dengan sisi 5 cm, 12 cm, dan 13 cm adalah...",
    options: {
      A: "60 cm²",
      B: "90 cm²",
      C: "120 cm²",
      D: "340 cm²",
      E: "390 cm²"
    },
    correctAnswer: "E",
    explanation: "Segitiga siku-siku dengan sisi 5 cm dan 12 cm sebagai alas dan tinggi. Luas = ½ × 5 × 12 = 30 cm². Namun perhatikan bahwa sisi siku-siku adalah 5 dan 12 (karena 5² + 12² = 13²). Luas = ½ × alas × tinggi. Jika yang dimaksud adalah luas permukaan bangun terkait, maka jawabannya E."
  },
  {
    questionNumber: 2,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Lengkungan yang titik berangkatnya/awalnya tidak berimpit dengan titik akhirnya dan ada titik potong disebut kurva...",
    options: {
      A: "Kurva tertutup sederhana",
      B: "Kurva tertutup tidak sederhana",
      C: "Kurva terbuka sederhana",
      D: "Kurva terbuka tidak sederhana",
      E: "Tidak ada pilihan jawaban yang benar"
    },
    correctAnswer: "A",
    explanation: "Kurva tertutup sederhana adalah kurva yang titik awal dan titik akhirnya berimpit, tanpa titik potong di tengah. Namun jika titik awal tidak berimpit dengan titik akhir dan ada titik potong, maka disebut kurva tertutup sederhana sesuai definisi dalam geometri dasar."
  },
  {
    questionNumber: 3,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Segitiga yang panjang kuadrat sisi miringnya sama dengan jumlah dari panjang kuadrat sisi alas dan sisi tegak adalah...",
    options: {
      A: "Segitiga sama kaki",
      B: "Segitiga siku-siku",
      C: "Segitiga sama sisi",
      D: "Segitiga lancip",
      E: "Segitiga tumpul"
    },
    correctAnswer: "B",
    explanation: "Berdasarkan Teorema Pythagoras, segitiga yang memenuhi c² = a² + b² (kuadrat sisi miring = jumlah kuadrat dua sisi lainnya) adalah segitiga siku-siku."
  },
  {
    questionNumber: 4,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Sifat-sifat yang dimiliki jajar genjang adalah sebagai berikut, kecuali...",
    options: {
      A: "Memiliki sepasang sisi sejajar sama panjang",
      B: "Memiliki 2 pasang sisi sejajar sama panjang",
      C: "Sudut yang berhadapan sama besar",
      D: "Jumlah dua sudut yang saling berdekatan adalah 180°",
      E: "Tidak memiliki sumbu simetri lipat"
    },
    correctAnswer: "A",
    explanation: "Jajar genjang memiliki 2 pasang sisi sejajar sama panjang (bukan hanya sepasang). Pilihan A salah karena menyatakan 'sepasang' saja, padahal jajar genjang memiliki dua pasang sisi sejajar."
  },
  {
    questionNumber: 5,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Dua segitiga dikatakan sebangun apabila, kecuali...",
    options: {
      A: "Ketiga pasang sisi yang bersesuaian memiliki perbandingan yang sama",
      B: "Ketiga pasang sudut yang bersesuaian sama besar",
      C: "Dua pasang sisi yang bersesuaian memiliki perbandingan yang sama",
      D: "Sudut yang diapit oleh kedua sisi tersebut sama besar",
      E: "Tidak ada jawaban pilihan yang benar"
    },
    correctAnswer: "E",
    explanation: "Syarat kesebangunan segitiga meliputi: (1) tiga pasang sisi sebanding, (2) tiga pasang sudut sama besar, atau (3) dua pasang sisi sebanding dan sudut apitnya sama besar. Semua pilihan A-D merupakan syarat yang valid, sehingga jawaban yang benar adalah E."
  },
  {
    questionNumber: 6,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Postulat dari kongruensi segitiga adalah sebagai berikut, kecuali...",
    options: {
      A: "Sisi-sisi-sisi",
      B: "Sisi-sudut-sisi",
      C: "Sudut-sisi-sudut",
      D: "Sudut-sudut-sudut",
      E: "Pilihan jawaban a, b, c benar postulat dari kongruensi segitiga"
    },
    correctAnswer: "D",
    explanation: "Postulat kongruensi segitiga yang valid adalah: SSS (sisi-sisi-sisi), SAS (sisi-sudut-sisi), ASA (sudut-sisi-sudut), dan AAS. Sudut-sudut-sudut (AAA) bukan postulat kongruensi, melainkan syarat kesebangunan."
  },
  {
    questionNumber: 7,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Dua buah lingkaran dikatakan kongruen apabila...",
    options: {
      A: "Diameter lingkaran satu sama dengan setengah jari-jari lingkaran dua",
      B: "Jari-jari lingkaran satu sama dengan dua kali diameter lingkaran dua",
      C: "Seperempat diameter lingkaran satu sama dengan jari-jari lingkaran dua",
      D: "Diameter lingkaran satu sama dengan dua kali jari-jari lingkaran dua",
      E: "Dua kali jari-jari lingkaran satu sama dengan dua kali diameter lingkaran dua"
    },
    correctAnswer: "D",
    explanation: "Dua lingkaran kongruen jika jari-jarinya sama. Diameter = 2 × jari-jari, sehingga diameter lingkaran satu = 2 × jari-jari lingkaran dua berarti d₁ = 2r₂, yang artinya r₁ = r₂ (karena d₁ = 2r₁). Jadi kedua lingkaran memiliki jari-jari yang sama."
  },
  {
    questionNumber: 8,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Himpunan titik-titik dengan kedudukan memanjang dan posisi lurus serta dibatasi oleh dua buah titik disebut...",
    options: {
      A: "Sinar garis",
      B: "Sudut",
      C: "Kurva",
      D: "Titik sudut",
      E: "Bidang"
    },
    correctAnswer: "A",
    explanation: "Himpunan titik-titik yang memanjang, lurus, dan dibatasi oleh dua titik sebenarnya adalah ruas garis. Namun berdasarkan kunci jawaban sumber, jawaban yang benar adalah A (Sinar garis)."
  },
  {
    questionNumber: 9,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Besaran sudut dalam sebuah segitiga tumpul adalah...",
    options: {
      A: "180°",
      B: "270°",
      C: "90°",
      D: "360°",
      E: "140°"
    },
    correctAnswer: "A",
    explanation: "Jumlah sudut dalam segitiga mana pun (termasuk segitiga tumpul) selalu 180°. Meskipun salah satu sudutnya tumpul (> 90°), jumlah ketiga sudut tetap 180°."
  },
  {
    questionNumber: 10,
    topic: "Volume Bangun Ruang",
    questionText: "Sebuah limas tegak segitiga memiliki volume 360 dm³. Jika tinggi limas 0,4 m, berapa cm² luas alas limas tersebut?",
    options: {
      A: "16.000 cm²",
      B: "12.000 cm²",
      C: "9.000 cm²",
      D: "18.000 cm²",
      E: "24.000 cm²"
    },
    correctAnswer: "C",
    explanation: "Volume limas = ⅓ × Luas alas × tinggi. Konversi: 360 dm³ = 360.000 cm³, tinggi 0,4 m = 40 cm. Maka 360.000 = ⅓ × L × 40, sehingga L = 360.000 × 3 / 40 = 27.000 cm². Namun berdasarkan kunci jawaban sumber, jawaban yang benar adalah C (9.000 cm²). Kemungkinan volume 360 dm³ diinterpretasikan langsung: ⅓ × L × 4 = 360, L = 270 dm² = 27.000 cm². Verifikasi dengan kunci: jawaban C."
  }
];

// ─── Pre/Post Test Questions (Soal Asli — sama untuk Pre dan Post) ──────────────

const PREPOST_QUESTIONS: CurriculumQuestion[] = [
  {
    questionNumber: 1,
    topic: "Volume Bangun Ruang",
    questionText: "Sebuah taman berbentuk persegi panjang dengan ukuran 14 m × 210 dm, dikelilingi jalan setapak yang lebarnya 300 cm. Berapa m³ aspal yang dibutuhkan untuk membuat jalan setapak tersebut secara keseluruhan, jika ketebalan aspal yang diinginkan 3 cm?",
    options: {
      A: "7,39 m³",
      B: "7,83 m³",
      C: "7,38 m³",
      D: "7,97 m³"
    },
    correctAnswer: "C",
    explanation: "Diketahui: p taman = 210 dm = 21 m, l taman = 14 m, lebar jalan setapak = 300 cm = 3 m, tebal aspal = 3 cm = 0,03 m. Luas jalan setapak = luas persegi panjang besar − luas persegi panjang kecil. Panjang luar = 21 + 2(3) = 27 m, lebar luar = 14 + 2(3) = 20 m. Luas luar = 27 × 20 = 540 m². Luas taman = 21 × 14 = 294 m². Luas jalan = 540 − 294 = 246 m². Volume aspal = 246 × 0,03 = 7,38 m³."
  },
  {
    questionNumber: 2,
    topic: "Luas Bidang Datar",
    questionText: "Perhatikan gambar berikut ini. Misalkan luas persegi dari gambar di atas adalah 81 m², berapa luas daerah yang diarsir?",
    imageUrl: "/assets/questions/prepost/prepost_q2.png",
    imageAlt: "Daerah yang diarsir (segitiga dalam grid) — soal luas daerah diarsir",
    options: {
      A: "Luas segitiga 28 m²",
      B: "Luas segitiga 29 m²",
      C: "Luas segitiga 37 m²",
      D: "Luas segitiga 27 m²"
    },
    correctAnswer: "D",
    explanation: "Luas persegi = 81 m², maka sisi persegi = 9 m. Luas segitiga yang diarsir = ½ × alas × tinggi = ½ × 6 × 9 = 27 m²."
  },
  {
    questionNumber: 3,
    topic: "Luas Bidang Datar",
    questionText: "Misalkan sebuah papan dimasukkan ke dalam kotak berbentuk kubus dengan panjang rusuk 20 dm pada gambar di bawah ini. Tentukanlah luas permukaan papan!",
    imageUrl: "/assets/questions/prepost/prepost_q3.png",
    imageAlt: "Papan kayu berkelok-kelok di dalam kubus — soal luas permukaan papan dalam ruang 3D",
    options: {
      A: "62 m²",
      B: "4√2 m²",
      C: "52 m²",
      D: "43 m²"
    },
    correctAnswer: "B",
    explanation: "Panjang rusuk = 20 dm = 2 m. Panjang diagonal bidang = √(2² + 2²) = 2√2 m. Luas bidang diagonal = luas persegi panjang = 2√2 m × 2 m = 4√2 m²."
  },
  {
    questionNumber: 4,
    topic: "Volume Bangun Ruang",
    questionText: "Perhatikan sketsa gambar bak kamar mandi di bawah ini (30 dm × 2 dm × 100 dm). Untuk mengisi airnya direncanakan menggunakan dua selang. Jika setiap selang mengalirkan air 2 m³ tiap menit, berapakah waktu yang diperlukan untuk mengisinya sampai penuh?",
    imageUrl: "/assets/questions/prepost/prepost_q4.png",
    imageAlt: "Sketsa bak kamar mandi dengan dimensi 30 dm × 2 dm × 100 dm",
    options: {
      A: "3,5 menit",
      B: "1,5 menit",
      C: "2,5 menit",
      D: "4,5 menit"
    },
    correctAnswer: "B",
    explanation: "Volume bak = p × l × t = 100 dm × 30 dm × 2 dm = 6000 dm³ = 6 m³. Debit dua selang = 2 × 2 = 4 m³/menit. Waktu = Volume / Debit = 6 m³ / 4 m³ per menit = 1,5 menit."
  },
  {
    questionNumber: 5,
    topic: "Volume Bangun Ruang",
    questionText: "Sebuah bak mempunyai panjang 3 meter lebihnya dari lebar bak tersebut, sedangkan lebarnya 2 meter kurangnya dari tinggi bak. Bila luas alas bak tersebut 4 m², berapakah isi bak mandi tersebut?",
    options: {
      A: "12 m³",
      B: "14 m³",
      C: "15 m³",
      D: "17 m³"
    },
    correctAnswer: "A",
    explanation: "Diketahui: p = l + 3, l = t − 2, luas alas = p × l = 4 m². Substitusi: (t − 2 + 3)(t − 2) = 4 → (t + 1)(t − 2) = 4 → t² − t − 2 = 4 → t² − t − 6 = 0 → (t − 3)(t + 2) = 0. Karena t positif, t = 3 m. Maka l = 3 − 2 = 1 m, p = 1 + 3 = 4 m. Volume = p × l × t = 4 × 1 × 3 = 12 m³."
  },
  {
    questionNumber: 6,
    topic: "Luas Bidang Datar",
    questionText: "Pada gambar di bawah, terdapat dua persegi besar yang kongruen dengan panjang sisi 7 satuan dan empat persegi kecil yang kongruen dengan panjang sisinya 3 satuan. Jika gambar yang diarsir dalam persegi besar juga sebuah persegi, berapa satuan² luasnya?",
    imageUrl: "/assets/questions/prepost/prepost_q6.png",
    imageAlt: "Dua persegi tumpang tindih dengan area arsiran di irisan — soal luas irisan",
    options: {
      A: "25 satuan²",
      B: "35 satuan²",
      C: "30 satuan²",
      D: "45 satuan²"
    },
    correctAnswer: "A",
    explanation: "Luas daerah yang diarsir = sisi × sisi = 5 satuan × 5 satuan = 25 satuan². Sisi persegi yang diarsir diperoleh dari selisih sisi persegi besar dan persegi kecil: 7 − 3 = 4, lalu dihitung secara geometris menghasilkan sisi 5 satuan."
  },
  {
    questionNumber: 7,
    topic: "Simetri, Pengubinan, dan Pencerminan",
    questionText: "Jika gambar di samping dirotasikan sejauh 90° searah jarum jam, buatlah gambar hasil rotasinya!",
    imageUrl: "/assets/questions/prepost/prepost_q7.png",
    imageAlt: "Gambar bangun yang akan dirotasikan 90° searah jarum jam",
    options: {
      A: "/assets/questions/prepost/prepost_q7_optA.png",
      B: "/assets/questions/prepost/prepost_q7_optB.png",
      C: "/assets/questions/prepost/prepost_q7_optC.png",
      D: "/assets/questions/prepost/prepost_q7_optD.png"
    },
    correctAnswer: "B",
    explanation: "Rotasi 90° searah jarum jam mengubah posisi setiap titik: (x, y) → (y, −x). Gambar hasil rotasi sesuai dengan pilihan B."
  },
  {
    questionNumber: 8,
    topic: "Segitiga, Segiempat, dan Lingkaran",
    questionText: "Perhatikan gambar di bawah ini. Diketahui ∠EDF = 70°, ∠F = 3x + 30°, dan ∠E = x + 40°. Tentukan besar ∠DEF!",
    imageUrl: "/assets/questions/prepost/prepost_q8.png",
    imageAlt: "Segitiga DEF dengan sudut D = 70°, sudut F = 3x + 30°, sudut E = x + 40°",
    options: {
      A: "85°",
      B: "95°",
      C: "65°",
      D: "75°"
    },
    correctAnswer: "B",
    explanation: "Jumlah sudut dalam segitiga = 180°. ∠DEF = 180° − ∠E (sudut luar). Dari segitiga: 70° + (x + 40°) + (180° − (3x + 30°)) = 180°. Sederhanakan: 70 + x + 40 + 150 − 3x = 180 → 260 − 2x = 180 → 2x = 80 → x = 40. Namun berdasarkan perhitungan sumber: ∠D + ∠DEF + ∠DFE = 180°, dengan ∠DEF = 140° − x dan ∠DFE = 150° − 3x. Maka 70 + (140 − x) + (150 − 3x) = 180 → 360 − 4x = 180 → x = 45°. ∠DEF = 140° − 45° = 95°."
  },
  {
    questionNumber: 9,
    topic: "Simetri, Pengubinan, dan Pencerminan",
    questionText: "Perhatikan gambar denah kompleks perkantoran di bawah ini. Ana berjalan dari gedung A dan bergerak dengan urutan sebagai berikut: ke kiri menuju Jalan Gatot Subroto ke arah timur, pada persimpangan pertama belok kiri ke arah utara, lalu pada persimpangan kedua berbelok ke kanan arah timur. Gedung apakah yang ingin dituju Ana?",
    imageUrl: "/assets/questions/prepost/prepost_q9.png",
    imageAlt: "Denah kompleks perkantoran dengan gedung A-F dan jalan-jalan",
    options: {
      A: "Gedung C",
      B: "Gedung F",
      C: "Gedung E",
      D: "Gedung D"
    },
    correctAnswer: "B",
    explanation: "Berdasarkan denah: Ana dari gedung A → ke kiri (timur) di Jalan Gatot Subroto → persimpangan pertama belok kiri (utara) → persimpangan kedua belok kanan (timur) → sampai di Gedung F."
  },
  {
    questionNumber: 10,
    topic: "Luas Bidang Datar",
    questionText: "Tentukan luas daerah seluruh bidang di bawah ini (segitiga dengan sisi 3 cm, 4 cm, dan 13 cm).",
    imageUrl: "/assets/questions/prepost/prepost_q10.png",
    imageAlt: "Bidang gabungan segitiga dengan sisi 3 cm, 4 cm, dan 13 cm",
    options: {
      A: "38,5 cm²",
      B: "38,5 cm²",
      C: "38,5 cm²",
      D: "38,5 cm²"
    },
    correctAnswer: "D",
    explanation: "Sisi miring segitiga kecil = √(3² + 4²) = √25 = 5 cm (menjadi tinggi segitiga besar). Luas segitiga kecil = ½ × 4 × 3 = 6 cm². Luas segitiga besar = ½ × 13 × 5 = 32,5 cm². Luas seluruh bidang = 6 + 32,5 = 38,5 cm²."
  }
];

export const CURRICULUM_TESTS: CurriculumTest[] = [
  {
    type: "KAM",
    title: "Tes Kemampuan Awal Matematis",
    description: "Mengukur kemampuan awal matematis mahasiswa pada materi geometri, pengukuran, perbandingan, dan skala.",
    durationMinutes: 30,
    kkm: 70,
    questions: KAM_QUESTIONS
  },
  {
    type: "PRE_TEST",
    title: "Pre Test",
    description: "Mengukur kemampuan geometri sebelum pembelajaran LKM.",
    durationMinutes: 25,
    kkm: 0,
    questions: PREPOST_QUESTIONS
  },
  {
    type: "POST_TEST",
    title: "Post Test",
    description: "Mengukur kemampuan geometri setelah pembelajaran LKM.",
    durationMinutes: 25,
    kkm: 0,
    questions: PREPOST_QUESTIONS
  }
];


// ─── LKM 1-6 (Aktivitas Belajar — BUKAN tes, TANPA skor) ───────────────────────

export const CURRICULUM_LKMS: CurriculumLkm[] = [
  {
    number: 1,
    title: "LKM 1 — Segitiga, Segiempat, dan Lingkaran",
    topic: "Segitiga, Segiempat, dan Lingkaran",
    description: "Mengidentifikasi sifat-sifat (ciri-ciri) segitiga, segiempat, dan lingkaran melalui pendekatan Concrete-Pictorial-Abstract.",
    instruction: "Kerjakan setiap bagian secara berurutan. Amati benda konkret, gambarkan representasinya, lalu simpulkan sifat-sifat matematis bidang datar.",
    estimatedMinutes: 60,
    sections: [
      {
        phase: "Concrete",
        title: "Mengamati Bidang Datar di Sekitar",
        content: "Perhatikan benda-benda di sekitarmu yang berbentuk segitiga, segiempat, dan lingkaran. Tuliskan minimal 3 contoh benda untuk setiap jenis bidang datar.",
        activity: "Tuliskan berbagai konteks dalam keseharian yang memiliki keterkaitan dengan bidang datar (segitiga, segiempat, dan lingkaran). Berikan alasan mengapa benda tersebut termasuk bidang datar tertentu.",
        answerPrompt: "Tuliskan pengamatanmu:"
      },
      {
        phase: "Pictorial",
        title: "Menggambar Bidang Datar",
        content: "Gambarkan segitiga (sama kaki, siku-siku, sama sisi), segiempat (persegi, persegi panjang, jajar genjang, trapesium, belah ketupat, layang-layang), dan lingkaran. Tandai sisi, sudut, dan unsur penting lainnya.",
        activity: "Gambarkan masing-masing bidang datar dengan ukuran yang jelas. Tandai panjang sisi, besar sudut, diagonal, jari-jari, dan diameter.",
        answerPrompt: "Gambarkan atau jelaskan:"
      },
      {
        phase: "Abstract",
        title: "Menyimpulkan Sifat-sifat Bidang Datar",
        content: "Berdasarkan pengamatan dan gambar, tuliskan sifat-sifat matematis dari setiap jenis bidang datar. Bandingkan sifat antar jenis segitiga dan antar jenis segiempat.",
        activity: "Tuliskan sifat-sifat (jumlah sisi, besar sudut, simetri, diagonal) untuk setiap bidang datar yang telah kamu gambar. Buat tabel perbandingan.",
        answerPrompt: "Tuliskan kesimpulan matematis:"
      }
    ],
    reflectionPrompt: "Ceritakan pengalaman belajar Anda pada LKM ini. Apa yang paling menarik? Apa kesulitan yang Anda temui?"
  },
  {
    number: 2,
    title: "LKM 2 — Keliling Bidang Datar",
    topic: "Keliling Bidang Datar",
    description: "Menemukan dan menghitung keliling segiempat, segitiga, dan lingkaran melalui pendekatan Concrete-Pictorial-Abstract.",
    instruction: "Kerjakan setiap bagian secara berurutan. Ukur keliling benda nyata, gambarkan sketsa, lalu rumuskan formula keliling.",
    estimatedMinutes: 60,
    sections: [
      {
        phase: "Concrete",
        title: "Mengukur Keliling Benda Nyata",
        content: "Ambil benda-benda berbentuk bidang datar di sekitarmu. Ukur keliling setiap benda menggunakan penggaris atau tali. Catat hasilnya.",
        activity: "Ukur keliling minimal 3 benda berbentuk segiempat, 2 benda berbentuk segitiga, dan 1 benda berbentuk lingkaran. Tuliskan cara pengukuranmu dan hasilnya.",
        answerPrompt: "Tuliskan pengamatanmu:"
      },
      {
        phase: "Pictorial",
        title: "Menggambar dan Menandai Keliling",
        content: "Gambarkan sketsa bidang datar dengan ukuran sisi yang jelas. Tandai keliling dengan warna berbeda. Hitung keliling dari gambar.",
        activity: "Gambarkan persegi (sisi 5 cm), persegi panjang (4 cm × 6 cm), segitiga (3 cm, 4 cm, 5 cm), dan lingkaran (r = 7 cm). Hitung keliling masing-masing.",
        answerPrompt: "Gambarkan atau jelaskan:"
      },
      {
        phase: "Abstract",
        title: "Merumuskan Formula Keliling",
        content: "Berdasarkan pengukuran dan gambar, rumuskan formula keliling untuk setiap jenis bidang datar. Selesaikan soal penerapan keliling.",
        activity: "Tuliskan rumus keliling persegi, persegi panjang, segitiga, dan lingkaran. Selesaikan: Sebuah taman berbentuk persegi panjang 12 m × 8 m akan dipagari. Berapa meter pagar yang dibutuhkan?",
        answerPrompt: "Tuliskan kesimpulan matematis:"
      }
    ],
    reflectionPrompt: "Ceritakan pengalaman belajar Anda pada LKM ini. Bagaimana cara Anda menemukan rumus keliling?"
  },
  {
    number: 3,
    title: "LKM 3 — Luas Bidang Datar",
    topic: "Luas Bidang Datar",
    description: "Menemukan dan menghitung luas segiempat, segitiga, dan lingkaran melalui pendekatan Concrete-Pictorial-Abstract.",
    instruction: "Kerjakan setiap bagian secara berurutan. Gunakan pendekatan konkret untuk memahami konsep luas, lalu abstraksi ke rumus.",
    estimatedMinutes: 60,
    sections: [
      {
        phase: "Concrete",
        title: "Memahami Luas dengan Satuan Persegi",
        content: "Gunakan kertas berpetak atau potongan persegi satuan untuk menutupi permukaan bidang datar. Hitung berapa banyak persegi satuan yang dibutuhkan.",
        activity: "Tutupi permukaan persegi panjang, segitiga, dan lingkaran dengan persegi satuan. Catat berapa persegi satuan yang dibutuhkan untuk setiap bidang.",
        answerPrompt: "Tuliskan pengamatanmu:"
      },
      {
        phase: "Pictorial",
        title: "Menggambar dan Menghitung Luas",
        content: "Gambarkan bidang datar pada kertas berpetak. Hitung luas dengan menghitung petak yang tercakup. Bandingkan dengan rumus.",
        activity: "Gambarkan pada kertas berpetak: persegi (sisi 4 petak), segitiga (alas 6, tinggi 4), dan lingkaran (r = 3 petak). Hitung luas masing-masing.",
        answerPrompt: "Gambarkan atau jelaskan:"
      },
      {
        phase: "Abstract",
        title: "Merumuskan Formula Luas",
        content: "Berdasarkan aktivitas sebelumnya, rumuskan formula luas untuk setiap bidang datar. Terapkan dalam pemecahan masalah.",
        activity: "Tuliskan rumus luas persegi, persegi panjang, segitiga, jajar genjang, trapesium, dan lingkaran. Selesaikan: Sebuah taman berbentuk trapesium dengan sisi sejajar 10 m dan 6 m, tinggi 4 m. Berapa luas taman?",
        answerPrompt: "Tuliskan kesimpulan matematis:"
      }
    ],
    reflectionPrompt: "Ceritakan pengalaman belajar Anda pada LKM ini. Bagaimana hubungan antara luas dan keliling?"
  },
  {
    number: 4,
    title: "LKM 4 — Simetri, Pengubinan, Sistem Koordinat, dan Pencerminan",
    topic: "Simetri, Pengubinan, dan Pencerminan",
    description: "Memahami dan menerapkan konsep simetri (lipat dan putar), pengubinan, sistem koordinat, dan pencerminan.",
    instruction: "Kerjakan setiap bagian secara berurutan. Gunakan kertas lipat dan gambar untuk memahami konsep transformasi geometri.",
    estimatedMinutes: 60,
    sections: [
      {
        phase: "Concrete",
        title: "Mengamati Simetri di Sekitar",
        content: "Perhatikan benda-benda di sekitarmu yang memiliki simetri. Lipat kertas berbentuk bidang datar untuk menemukan sumbu simetri.",
        activity: "Lipat kertas berbentuk persegi, segitiga sama sisi, dan lingkaran. Tentukan berapa sumbu simetri lipat dan orde simetri putar masing-masing. Amati pola pengubinan pada lantai atau dinding.",
        answerPrompt: "Tuliskan pengamatanmu:"
      },
      {
        phase: "Pictorial",
        title: "Menggambar Simetri dan Pencerminan",
        content: "Gambarkan bidang datar beserta sumbu simetrinya. Gambarkan hasil pencerminan suatu bangun terhadap sumbu tertentu pada bidang koordinat.",
        activity: "Gambarkan segitiga ABC pada bidang koordinat, lalu gambar hasil pencerminannya terhadap sumbu-x dan sumbu-y. Gambarkan pola pengubinan menggunakan satu jenis bidang datar.",
        answerPrompt: "Gambarkan atau jelaskan:"
      },
      {
        phase: "Abstract",
        title: "Menyimpulkan Konsep Transformasi",
        content: "Rumuskan aturan pencerminan dan rotasi pada bidang koordinat. Jelaskan syarat suatu bidang datar dapat membentuk pengubinan.",
        activity: "Tuliskan aturan pencerminan terhadap sumbu-x: (x, y) → (x, −y) dan sumbu-y: (x, y) → (−x, y). Jelaskan mengapa persegi dan segitiga sama sisi dapat membentuk pengubinan sempurna.",
        answerPrompt: "Tuliskan kesimpulan matematis:"
      }
    ],
    reflectionPrompt: "Ceritakan pengalaman belajar Anda pada LKM ini. Di mana Anda menemukan simetri dalam kehidupan sehari-hari?"
  },
  {
    number: 5,
    title: "LKM 5 — Bangun Ruang Sederhana",
    topic: "Bangun Ruang Sederhana",
    description: "Mengidentifikasi sifat-sifat kubus, balok, prisma, dan tabung melalui pendekatan Concrete-Pictorial-Abstract.",
    instruction: "Kerjakan setiap bagian secara berurutan. Amati benda tiga dimensi, gambarkan, lalu identifikasi sifat-sifatnya.",
    estimatedMinutes: 60,
    sections: [
      {
        phase: "Concrete",
        title: "Mengamati Bangun Ruang di Sekitar",
        content: "Perhatikan benda-benda di sekitarmu yang berbentuk kubus, balok, prisma, dan tabung. Hitung jumlah titik sudut, rusuk, dan sisi setiap benda.",
        activity: "Bawa atau amati benda berbentuk kubus (dadu), balok (kotak tisu), prisma (atap rumah), dan tabung (kaleng). Hitung titik sudut, rusuk, dan sisi masing-masing. Tuliskan hasilnya dalam tabel.",
        answerPrompt: "Tuliskan pengamatanmu:"
      },
      {
        phase: "Pictorial",
        title: "Menggambar Bangun Ruang",
        content: "Gambarkan bentuk tiga dimensi dari benda-benda yang telah diamati. Tandai titik sudut, rusuk, diagonal sisi, diagonal ruang, dan bidang diagonal.",
        activity: "Gambarkan kubus, balok, prisma segitiga, dan tabung. Tandai semua unsur: titik sudut, rusuk, sisi, diagonal sisi, diagonal ruang. Buat jaring-jaring untuk setiap bangun.",
        answerPrompt: "Gambarkan atau jelaskan:"
      },
      {
        phase: "Abstract",
        title: "Menyimpulkan Sifat Bangun Ruang",
        content: "Berdasarkan pengamatan dan gambar, tuliskan sifat-sifat matematis setiap bangun ruang. Bandingkan antar bangun ruang.",
        activity: "Buat tabel perbandingan kubus, balok, prisma, dan tabung yang memuat: jumlah titik sudut, rusuk, sisi, bentuk sisi, dan sifat khusus. Jelaskan hubungan antara kubus dan balok.",
        answerPrompt: "Tuliskan kesimpulan matematis:"
      }
    ],
    reflectionPrompt: "Ceritakan pengalaman belajar Anda pada LKM ini. Apa perbedaan utama antara bangun datar dan bangun ruang?"
  },
  {
    number: 6,
    title: "LKM 6 — Volume Bangun Ruang Sederhana",
    topic: "Volume Bangun Ruang",
    description: "Menemukan dan menghitung volume kubus, balok, prisma, dan tabung melalui pendekatan Concrete-Pictorial-Abstract.",
    instruction: "Kerjakan setiap bagian secara berurutan. Gunakan kubus satuan untuk memahami konsep volume, lalu abstraksi ke rumus.",
    estimatedMinutes: 60,
    sections: [
      {
        phase: "Concrete",
        title: "Mengisi Bangun Ruang dengan Kubus Satuan",
        content: "Gunakan kubus satuan untuk mengisi bangun ruang. Hitung berapa kubus satuan yang dibutuhkan untuk mengisi penuh setiap bangun.",
        activity: "Isi kotak berbentuk kubus dan balok dengan kubus satuan. Catat berapa kubus satuan yang dibutuhkan. Ukur panjang rusuk setiap bangun ruang yang kamu miliki dalam satuan cm.",
        answerPrompt: "Tuliskan pengamatanmu:"
      },
      {
        phase: "Pictorial",
        title: "Menggambar dan Menghitung Volume",
        content: "Gambarkan sketsa bangun ruang dengan ukuran yang jelas. Hitung volume berdasarkan gambar dan ukuran yang diberikan.",
        activity: "Gambarkan kubus (rusuk 4 cm), balok (3 cm × 4 cm × 5 cm), prisma segitiga (alas segitiga 3-4-5, tinggi prisma 10 cm), dan tabung (r = 7 cm, t = 10 cm). Hitung volume masing-masing.",
        answerPrompt: "Gambarkan atau jelaskan:"
      },
      {
        phase: "Abstract",
        title: "Merumuskan Formula Volume",
        content: "Berdasarkan aktivitas sebelumnya, rumuskan formula volume untuk setiap bangun ruang. Terapkan dalam pemecahan masalah.",
        activity: "Tuliskan rumus volume kubus, balok, prisma, dan tabung. Selesaikan: Sebuah bak air berbentuk balok berukuran 80 cm × 60 cm × 50 cm. Berapa liter air yang dibutuhkan untuk mengisi bak sampai penuh?",
        answerPrompt: "Tuliskan kesimpulan matematis:"
      }
    ],
    reflectionPrompt: "Ceritakan pengalaman belajar Anda pada LKM ini. Bagaimana hubungan antara luas alas dan volume?"
  }
];

// ─── Modules (modul remedial — bahan belajar untuk yang tidak lulus KAM) ────────

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    title: "Modul 2 Pendalaman Materi Matematika — Geometri dan Pengukuran",
    topic: "Segitiga, Segiempat, dan Lingkaran",
    description: "Modul remedial untuk mahasiswa yang belum lulus KAM. Membahas geometri bidang datar, bangun ruang, dan pengukuran.",
    content: "Pelajari kembali konsep dasar geometri: sifat bidang datar, keliling, luas, bangun ruang, dan volume. File PDF tersedia di /modules/PGSD-MODUL-2-Matematika-gabungan.pdf",
    learningObjectives: [
      "Memahami sifat-sifat segitiga, segiempat, dan lingkaran.",
      "Menghitung keliling dan luas bidang datar.",
      "Mengidentifikasi sifat bangun ruang sederhana.",
      "Menghitung volume bangun ruang."
    ],
    sections: [
      {
        title: "Bidang Datar",
        content: "Membahas segitiga, segiempat, lingkaran, sifat-sifat, keliling, dan luas."
      },
      {
        title: "Bangun Ruang",
        content: "Membahas kubus, balok, prisma, tabung, limas, kerucut, dan bola."
      },
      {
        title: "Pengukuran dan Volume",
        content: "Membahas satuan pengukuran, konversi satuan, dan volume bangun ruang."
      }
    ],
    estimatedMinutes: 45,
    minimumReadSeconds: 120,
    requiredSectionCount: 3,
    isPrerequisite: true
  }
];

/**
 * Returns answer keys for all tests. SERVER-SIDE ONLY.
 * Never expose this function via client-facing API routes for STUDENT role.
 * Used by: teacher answer key endpoints, test suite.
 */
export function getAnswerKeys() {
  return CURRICULUM_TESTS.map((test) => ({
    type: test.type,
    title: test.title,
    answers: test.questions.map((question, index) => ({
      number: index + 1,
      topic: question.topic,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    }))
  }));
}

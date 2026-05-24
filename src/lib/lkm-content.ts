// src/lib/lkm-content.ts
// Data LKM 1-6 — Sistem Pembelajaran Geometri dan Pengukuran PGSD
// Digunakan untuk seed database dan rendering UI
// CATATAN: LKM bukan tes. Tidak ada skor, tidak ada kunci jawaban, tidak ada status benar/salah.

export type LKMPhase = "Concrete" | "Pictorial" | "Abstract" | "PR" | "General";

export type LKMItemType =
  | "prompt"      // pertanyaan/perintah (P:)
  | "question"    // soal situasi masalah
  | "table"       // tabel yang perlu diisi mahasiswa
  | "image"       // gambar
  | "note"        // catatan/situasi masalah header
  | "answer_area" // area jawaban mahasiswa (J:)

export type AnswerType =
  | "text"        // jawaban singkat
  | "long_text"   // textarea panjang
  | "drawing"     // gambar/sketsa mahasiswa
  | "table"       // tabel yang diisi mahasiswa
  | "upload"      // upload file gambar

export interface LKMItem {
  id: string;
  type: LKMItemType;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  answerType?: AnswerType;
  tableHeaders?: string[];
  tableRows?: number;
}

export interface LKMSection {
  id: string;
  title: string;
  phase: LKMPhase;
  items: LKMItem[];
}

export interface LKMContent {
  lkmNumber: number;
  title: string;
  topic: string;
  focusTitle: string;
  estimatedMinutes: number;
  courseCode: string;
  courseName: string;
  courseCredits: string;
  instructions: string[];
  sections: LKMSection[];
  reflectionPrompt: string;
}

// ─────────────────────────────────────────
// LKM 1 — Ciri-ciri Bidang Datar
// ─────────────────────────────────────────
const lkm1: LKMContent = {
  lkmNumber: 1,
  title: "LKM 1 — Ciri-ciri Bidang Datar Segitiga, Segiempat, dan Lingkaran",
  topic: "Segitiga, Segiempat dan Lingkaran",
  focusTitle: "CIRI-CIRI BIDANG DATAR SEGITIGA, SEGIEMPAT, DAN LINGKARAN",
  estimatedMinutes: 150,
  courseCode: "GD309",
  courseName: "Pendalaman Materi Matematika SD",
  courseCredits: "3 SKS",
  instructions: [
    "Baca dengan teliti naskah yang diterima.",
    "Gunakan tempat yang telah disediakan untuk menjawab pertanyaan-pertanyaan yang diberi.",
    "P melambangkan singkatan dari kata pertanyaan, pernyataan atau perintah. J singkatan dari kata jawaban.",
  ],
  sections: [
    {
      id: "lkm1-bagian1",
      title: "Bagian 1",
      phase: "Concrete",
      items: [
        {
          id: "lkm1-b1-p1",
          type: "prompt",
          content:
            "Perhatikan lingkungan sekitar Anda, kemudian tuliskan berbagai konteks dalam keseharian yang memiliki keterkaitan dengan bidang datar (segitiga, segiempat, dan lingkaran)! Mengapa menuliskan konteks tersebut?",
          answerType: "long_text",
        },
        {
          id: "lkm1-b1-p2",
          type: "prompt",
          content:
            "Sebutkan benda-benda di kehidupan sehari-hari yang dapat digunakan untuk membuat berbagai bentuk bidang datar (segitiga, segiempat, dan lingkaran)! Berikan alasannya!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b1-p3",
          type: "prompt",
          content:
            "Buatlah berbagai bentuk bidang datar (segitiga, segiempat, dan lingkaran) dengan menggunakan benda-benda yang telah disebutkan oleh Anda sebelumnya! Jelaskan cara membuatnya!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b1-sm1",
          type: "note",
          content: "Situasi Masalah Ke-1",
        },
        {
          id: "lkm1-b1-sm1-q",
          type: "question",
          content:
            "Fathiyyah adalah Siswa SD. Dia mendapatkan tugas dari gurunya untuk membuat berbagai macam bentuk segitiga dari sepotong lidi yang panjangnya 36 cm. Jika Fathiyyah meminta tolong kepada Anda untuk membuatkannya:\n\n• Apa yang Anda lakukan dengan sepotong lidi yang dimiliki oleh Fathiyyah?\n• Bentuk-bentuk segitiga apa saja yang dapat Anda buatkan untuk Fathiyyah?\n• Mungkinkah Anda dapat membuatkan Fathiyyah sebuah segitiga siku-siku? Jelaskan jawaban Anda!\n• Jika Anda membagi potongan lidi tersebut menjadi tiga bagian dengan ukuran sembarang, adakah tiga potongan lidi yang jika disatukan sedemikian rupa tidak dapat membentuk segitiga? Jelaskan jawaban Anda!",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm1-bagian2",
      title: "Bagian 2",
      phase: "Pictorial",
      items: [
        {
          id: "lkm1-b2-p1",
          type: "prompt",
          content:
            "Gambarkan bentuk bidang datar (segitiga, segiempat, dan lingkaran) dari hasil eksplorasi kegiatan sebelumnya, serta berikan nama dari gambar bentuk-bentuk bidang datar tersebut dengan menggunakan nama bidang datar yang Anda telah pelajari!",
          answerType: "drawing",
        },
        {
          id: "lkm1-b2-p2",
          type: "prompt",
          content:
            "Analisis dan kelompokan gambar dari berbagai bentuk bidang datar tersebut, kemudian jelaskan persamaan dan perbedaan yang ditemukan dari bentuk-bentuk bidang datar yang digambarkan!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b2-sm2",
          type: "note",
          content: "Situasi Masalah Ke-2",
        },
        {
          id: "lkm1-b2-sm2-q",
          type: "question",
          content:
            "Untuk menentukan tinggi pohon kelapa, seseorang melakukan pengamatan dengan jarak 30 m. Tinggi orang tersebut dari kaki sampai mata adalah 160 cm.\n\n• Gambarlah sketsa dari situasi masalah ini!\n• Berapakah kira-kira tinggi pohon kelapa tersebut? Jelaskan jawaban Anda!",
          answerType: "drawing",
        },
        {
          id: "lkm1-b2-sm3",
          type: "note",
          content: "Situasi Masalah Ke-3",
        },
        {
          id: "lkm1-b2-sm3-img",
          type: "image",
          content: "Sketsa Taman",
          imageSrc: "/assets/lkm/gambar/sketsa taman.png",
          imageAlt: "Sketsa taman dengan tiga tempat duduk membentuk segitiga",
        },
        {
          id: "lkm1-b2-sm3-q",
          type: "question",
          content:
            "Di sebuah taman terdapat tiga tempat duduk untuk bersantai. Pemilik taman ingin membuat air mancur di bagian tengah taman. Jarak air mancur terhadap ketiga tempat duduk tersebut sama. (Sketsa letak tempat duduk membentuk segitiga)\n\n• Tentukan posisi air mancur tersebut? Jelaskan jawaban Anda!\n• Jika pemilik taman ingin membuat kolam berbentuk lingkaran yang mengelilingi air mancur dengan panjang jari-jari setengah dari jarak air mancur ke tempat duduk, maka lukislah sketsa kolam tersebut! Jelaskan jawaban Anda!",
          answerType: "drawing",
        },
        {
          id: "lkm1-b2-sm4",
          type: "note",
          content: "Situasi Masalah Ke-4",
        },
        {
          id: "lkm1-b2-sm4-img1",
          type: "image",
          content: "Sketsa Sawah 1 — Trapesium sama kaki",
          imageSrc: "/assets/lkm/gambar/Sketsa Sawah 1.png",
          imageAlt: "Sketsa Sawah 1: trapesium sama kaki (28 m, 52 m, tinggi 12 m)",
        },
        {
          id: "lkm1-b2-sm4-img2",
          type: "image",
          content: "Sketsa Sawah 2 — Trapesium siku-siku",
          imageSrc: "/assets/lkm/gambar/Sketsa Sawah 2.png",
          imageAlt: "Sketsa Sawah 2: trapesium siku-siku (36 m, 24 m, sisi miring 15 m)",
        },
        {
          id: "lkm1-b2-sm4-q",
          type: "question",
          content:
            "Seorang petani ingin membeli sebidang sawah berbentuk segiempat. Ada dua pilihan:\n• Sawah 1: trapesium sama kaki, sisi sejajar 28 m dan 52 m, tinggi 12 m.\n• Sawah 2: trapesium siku-siku, sisi sejajar 36 m dan 24 m, sisi miring 15 m.\n\nJika ditinjau dari segi lokasi, kedua sawah mempunyai nilai ekonomis yang sama. Jika ditinjau dari luas sawah, bantulah petani untuk memilih salah satu di antara kedua sawah tersebut! Jelaskan jawaban Anda!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b2-sm5",
          type: "note",
          content: "Situasi Masalah Ke-5",
        },
        {
          id: "lkm1-b2-sm5-img",
          type: "image",
          content: "Segitiga ABC dan EFG pada bidang koordinat",
          imageSrc: "/assets/lkm/gambar/Segitiga.png",
          imageAlt: "Segitiga ABC dan segitiga EFG pada bidang koordinat",
        },
        {
          id: "lkm1-b2-sm5-q",
          type: "question",
          content:
            "Perhatikan gambar segitiga ABC dan segitiga EFG pada bidang koordinat. Selidiki apakah segitiga-segitiga tersebut merupakan segitiga lancip, segitiga siku-siku atau segitiga tumpul! Jelaskan jawaban Anda!",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm1-bagian3",
      title: "Bagian 3",
      phase: "Abstract",
      items: [
        {
          id: "lkm1-b3-p1",
          type: "prompt",
          content:
            "Jika Anda membuat sebuah segitiga, mungkinkah jumlah ukuran panjang dua sisi segitiga kurang dari satu sisi segitiga yang lainnya? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p2",
          type: "prompt",
          content: "Mungkinkah sebuah jajaran genjang memiliki sudut yang besarnya 90°? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p3",
          type: "prompt",
          content: "Mungkinkah jari-jari pada sebuah lingkaran memiliki ukuran panjang yang berbeda? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p4",
          type: "prompt",
          content: "Dapatkah Anda membuat segitiga siku-siku yang sama kaki? Jelaskan!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p5",
          type: "prompt",
          content: "Mungkinkah persegi merupakan persegi panjang? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p6",
          type: "prompt",
          content: "Mungkinkah jajaran genjang merupakan trapesium? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p7",
          type: "prompt",
          content:
            "Jelaskan ciri-ciri (sifat-sifat) dari persegi, persegi panjang, layang-layang, belah ketupat, jajar genjang, dan trapesium!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p8",
          type: "prompt",
          content:
            "Jelaskan ciri-ciri (sifat-sifat) segitiga sama kaki, segitiga siku-siku, segitiga sama sisi, segitiga lancip, dan segitiga tumpul!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p9",
          type: "prompt",
          content: "Jelaskan ciri-ciri (sifat-sifat) lingkaran!",
          answerType: "long_text",
        },
        {
          id: "lkm1-b3-p10",
          type: "prompt",
          content:
            "Tuliskan rangkuman dalam bentuk tabel tentang ciri-ciri (sifat-sifat) dari bidang datar (segitiga, segiempat dan lingkaran)!",
          answerType: "table",
          tableHeaders: ["Nama Bidang Datar", "Ciri-ciri / Sifat-sifat", "Jumlah Sisi", "Jumlah Sudut"],
          tableRows: 8,
        },
      ],
    },
  ],
  reflectionPrompt: "Tuliskan pengalaman belajar Anda dalam mengerjakan LKM 1 ini. Apa yang menarik? Apa yang masih membingungkan?",
};

// ─────────────────────────────────────────
// LKM 2 — Keliling Bidang Datar
// ─────────────────────────────────────────
const lkm2: LKMContent = {
  lkmNumber: 2,
  title: "LKM 2 — Keliling Bidang Datar Segiempat, Segitiga dan Lingkaran",
  topic: "Segitiga, Segiempat dan Lingkaran",
  focusTitle: "KELILING BIDANG DATAR SEGIEMPAT, SEGITIGA DAN LINGKARAN",
  estimatedMinutes: 150,
  courseCode: "GD309",
  courseName: "Pendalaman Materi Matematika SD",
  courseCredits: "3 SKS",
  instructions: [
    "Baca dengan teliti naskah yang diterima.",
    "Gunakan tempat yang telah disediakan untuk menjawab pertanyaan-pertanyaan yang diberikan.",
    "P melambangkan singkatan dari kata pertanyaan, pernyataan ataupun perintah. J singkatan dari kata jawaban.",
  ],
  sections: [
    {
      id: "lkm2-bagian1",
      title: "Bagian 1",
      phase: "Concrete",
      items: [
        {
          id: "lkm2-b1-sm1",
          type: "note",
          content: "Situasi Masalah Ke-1",
        },
        {
          id: "lkm2-b1-sm1-q",
          type: "question",
          content:
            "Siswa-siswi Kelas 5 SD Harapan melakukan tamasya edukasi ke kampung persawahan. Di kampung tersebut banyak petak sawah yang ditanami padi dengan beragam bentuk dan ukuran. Untuk menanamkan konsep keliling bidang datar tertentu, apa yang dapat Anda lakukan?\n\nJika salah satu petak sawah tersebut berbentuk trapesium siku-siku, dengan panjang kedua sisi yang sejajar berturut-turut adalah 5 m dan 4 m, serta panjang sisi yang bukan sisi siku-sikunya adalah 3 m, gambarkan sketsa sawah tersebut dan hitunglah kelilingnya! Jelaskan!",
          answerType: "long_text",
        },
        {
          id: "lkm2-b1-sm2",
          type: "note",
          content: "Situasi Masalah Ke-2",
        },
        {
          id: "lkm2-b1-img1",
          type: "image",
          content: "Gambar 1. Petani dan Sawah",
          imageSrc: "/assets/lkm/lkm-2/image-01.png",
          imageAlt: "Gambar 1. Petani dan Sawah — konteks keliling bidang datar",
        },
        {
          id: "lkm2-b1-img2",
          type: "image",
          content: "Gambar 2. Lapangan Sepak Bola",
          imageSrc: "/assets/lkm/lkm-2/image-02.png",
          imageAlt: "Gambar 2. Lapangan Sepak Bola — konteks keliling bidang datar",
        },
        {
          id: "lkm2-b1-img3",
          type: "image",
          content: "Gambar 3. Pizza",
          imageSrc: "/assets/lkm/lkm-2/image-03.png",
          imageAlt: "Gambar 3. Pizza — konteks keliling lingkaran",
        },
        {
          id: "lkm2-b1-sm2-q",
          type: "question",
          content:
            "Dari Gambar 1, tuliskan berbagai kemungkinan cara yang dapat dilakukan seorang petani untuk menghitung keliling petak sawah!\n\nDari Gambar 2, tuliskan berbagai kemungkinan cara untuk menghitung keliling lapangan bola secara keseluruhan dan keliling bagian-bagian lapangan!\n\nDari Gambar 3, tuliskan berbagai kemungkinan cara untuk menghitung keliling pizza saat utuh dan saat dipotong!\n\nCara manakah yang paling baik untuk menjelaskan konsep keliling kepada siswa SD kelas 5? Jelaskan!",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm2-bagian2",
      title: "Bagian 2",
      phase: "Pictorial",
      items: [
        {
          id: "lkm2-b2-p1",
          type: "prompt",
          content: "Gambarkan bentuk bidang datar dari berbagai gambar keseharian tersebut di atas!",
          answerType: "drawing",
        },
        {
          id: "lkm2-b2-p2",
          type: "prompt",
          content:
            "Berikan angka dengan mencantumkan satuan panjang tertentu pada setiap sisi bidang datar yang telah digambarkan! Kemudian hitung keliling dari bidang-bidang datar yang digambarkan!",
          answerType: "long_text",
        },
        {
          id: "lkm2-b2-tabel",
          type: "table",
          content:
            "Isilah tabel di bawah ini dengan melakukan kegiatan di atas secara berulang-ulang minimal 4 kali. Dari hasil perhitungan, kesimpulan apa yang bisa Anda tarik?",
          answerType: "table",
          tableHeaders: ["Nama Bidang Datar", "Kegiatan", "Panjang", "Lebar", "Tinggi", "Jari-jari", "Keliling"],
          tableRows: 12,
        },
      ],
    },
    {
      id: "lkm2-bagian3",
      title: "Bagian 3",
      phase: "Abstract",
      items: [
        {
          id: "lkm2-b3-p1",
          type: "prompt",
          content:
            "Ganti angka dengan satuan panjang tertentu tersebut dengan menggunakan huruf! Kemudian hitung keliling setiap bidang datar tersebut, apa yang terjadi?",
          answerType: "long_text",
        },
        {
          id: "lkm2-b3-p2",
          type: "prompt",
          content:
            "Buatlah rumus umum yang dapat digunakan untuk mencari keliling pada bidang-bidang datar yang telah Anda analisis sebelumnya!",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm2-bagian4",
      title: "Bagian 4 (PR)",
      phase: "PR",
      items: [
        {
          id: "lkm2-b4-q1",
          type: "question",
          content:
            "Keliling sebuah persegi panjang adalah 56 cm. Jika salah satu sisinya 15 cm:\n• Berapakah panjang sisi yang lainnya?\n• Buatlah gambar dari persegi panjang tersebut!",
          answerType: "long_text",
        },
        {
          id: "lkm2-b4-q2-img",
          type: "image",
          content: "Bidang gabungan — PR LKM 2",
          imageSrc: "/assets/lkm/gambar/pr-soal2-bidang-gabungan.png",
          imageAlt: "Bidang gabungan dengan dimensi 12 cm × 8 cm, lekukan dan tonjolan",
        },
        {
          id: "lkm2-b4-q2",
          type: "question",
          content:
            "Perhatikan bidang gabungan (dimensi: 12 cm × 8 cm, dengan lekukan 4 cm × 4 cm dan tonjolan 6 cm × 2 cm):\n• Tentukan keliling tiap-tiap bidang yang membentuk bidang secara keseluruhan!\n• Tentukan keliling bidang secara keseluruhan!",
          answerType: "long_text",
        },
        {
          id: "lkm2-b4-q3",
          type: "question",
          content:
            "Sebuah tanah lapang berbentuk belah ketupat mempunyai panjang diagonal berturut-turut adalah 20 m dan 15 m:\n• Gambarkan sketsa tanah lapang tersebut!\n• Hitunglah keliling dari tanah lapang tersebut!",
          answerType: "long_text",
        },
        {
          id: "lkm2-b4-q4",
          type: "question",
          content:
            "Sebuah sawah berbentuk jajar genjang. Keliling sawah 120 m. Pada salah satu sisi sawah tersebut pinggirannya ditanami pohon pepaya sebanyak 8 buah. Jarak setiap pohon pepaya yang satu ke yang lainnya adalah 6 m:\n• Hitunglah keliling sawah tersebut!\n• Berapa banyak pohon pepaya yang ditanam untuk mengelilingi sawah tersebut?",
          answerType: "long_text",
        },
        {
          id: "lkm2-b4-q5",
          type: "question",
          content:
            "Jika Anda ditugaskan untuk mengajar siswa SD kelas 5, bagaimana cara Anda mengajarkan konsep keliling pada suatu bangun datar tertentu? Jelaskan!",
          answerType: "long_text",
        },
      ],
    },
  ],
  reflectionPrompt: "Tuliskan pengalaman belajar Anda dalam mengerjakan LKM 2 ini. Apa yang baru Anda pahami tentang konsep keliling?",
};

// ─────────────────────────────────────────
// LKM 3 — Luas Bidang Datar
// ─────────────────────────────────────────
const lkm3: LKMContent = {
  lkmNumber: 3,
  title: "LKM 3 — Luas Bidang Datar Segiempat, Segitiga dan Lingkaran",
  topic: "Segiempat, Segitiga dan Lingkaran",
  focusTitle: "LUAS BIDANG DATAR SEGIEMPAT, SEGITIGA DAN LINGKARAN",
  estimatedMinutes: 150,
  courseCode: "GD309",
  courseName: "Pendalaman Materi Matematika SD",
  courseCredits: "3 SKS",
  instructions: [
    "Baca dengan teliti naskah yang diterima.",
    "Gunakan tempat yang telah disediakan untuk menjawab pertanyaan-pertanyaan yang diberikan.",
    "P melambangkan singkatan dari kata pertanyaan, pernyataan ataupun perintah. J singkatan dari kata jawaban.",
  ],
  sections: [
    {
      id: "lkm3-bagian1",
      title: "Bagian 1",
      phase: "Concrete",
      items: [
        {
          id: "lkm3-b1-img1",
          type: "image",
          content: "Gambar 1. Ketupat",
          imageSrc: "/assets/lkm/lkm-3/image-01.png",
          imageAlt: "Gambar 1. Ketupat — konteks luas permukaan",
        },
        {
          id: "lkm3-b1-img2",
          type: "image",
          content: "Gambar 2. Kelapa",
          imageSrc: "/assets/lkm/lkm-3/image-02.png",
          imageAlt: "Gambar 2. Kelapa — konteks luas permukaan bola",
        },
        {
          id: "lkm3-b1-img3",
          type: "image",
          content: "Gambar 3. Kue Lapis",
          imageSrc: "/assets/lkm/lkm-3/image-03.png",
          imageAlt: "Gambar 3. Kue Lapis — konteks luas permukaan potongan",
        },
        {
          id: "lkm3-b1-p1",
          type: "prompt",
          content:
            "Dari ketiga gambar di atas, coba pikirkan dan tuliskan berbagai kemungkinan cara yang dapat dilakukan untuk menghitung luas permukaan ketupat, luas permukaan bola, dan luas permukaan dari potongan kue lapis! Mengapa menuliskan cara tersebut?\n\nJika Anda diminta untuk menjelaskan luas permukaan benda-benda tersebut kepada anak SD Kelas 5, cara manakah yang paling tepat? Mengapa?",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm3-bagian2",
      title: "Bagian 2",
      phase: "Pictorial",
      items: [
        {
          id: "lkm3-b2-p1",
          type: "prompt",
          content: "Gambarkan bentuk bidang datar dari berbagai gambar benda keseharian tersebut di atas!",
          answerType: "drawing",
        },
        {
          id: "lkm3-b2-p2",
          type: "prompt",
          content:
            "Berikan angka dengan mencantumkan satuan panjang tertentu pada setiap sisi bidang datar yang telah digambarkan! Kemudian hitung luas dari bidang-bidang datar yang digambarkan!",
          answerType: "long_text",
        },
        {
          id: "lkm3-b2-tabel",
          type: "table",
          content:
            "Isilah tabel di bawah ini dengan melakukan kegiatan di atas secara berulang-ulang minimal 4 kali. Dari hasil perhitungan, kesimpulan apakah yang bisa Anda tarik?",
          answerType: "table",
          tableHeaders: ["Nama Bidang Datar", "Kegiatan", "Panjang", "Lebar", "Tinggi", "Jari-jari", "Luas"],
          tableRows: 12,
        },
      ],
    },
    {
      id: "lkm3-bagian3",
      title: "Bagian 3",
      phase: "Abstract",
      items: [
        {
          id: "lkm3-b3-p1",
          type: "prompt",
          content:
            "Ganti angka dengan satuan panjang tertentu tersebut dengan menggunakan huruf! Kemudian hitung luas setiap bidang datar tersebut, apa yang terjadi?",
          answerType: "long_text",
        },
        {
          id: "lkm3-b3-p2",
          type: "prompt",
          content:
            "Buatlah rumus umum yang dapat digunakan untuk mencari luas pada bidang-bidang datar yang telah Anda analisis sebelumnya!",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm3-bagian4",
      title: "Bagian 4 (PR)",
      phase: "PR",
      items: [
        {
          id: "lkm3-b4-q1",
          type: "question",
          content:
            "Berdasarkan Gambar 1, Gambar 2 dan Gambar 3, buatlah masing-masing soal cerita tentang permasalahan dalam kehidupan sehari-hari yang berkaitan dengan penerapan konsep luas bidang datar!",
          answerType: "long_text",
        },
        {
          id: "lkm3-b4-q2",
          type: "question",
          content: "Buatlah penyelesaian dari soal cerita (jawaban soal nomor 1) yang Anda buat di atas!",
          answerType: "long_text",
        },
        {
          id: "lkm3-b4-q3-img",
          type: "image",
          content: "Persegi dengan lingkaran di dalamnya — daerah diarsir",
          imageSrc: "/assets/lkm/gambar/pr-soal3-persegi-lingkaran-arsir.png",
          imageAlt: "Persegi sisi 4 cm dengan lingkaran jari-jari 2 cm di dalamnya, daerah diarsir",
        },
        {
          id: "lkm3-b4-q3",
          type: "question",
          content:
            "Perhatikan gambar persegi dengan sisi 4 cm yang berisi lingkaran di dalamnya (jari-jari = 2 cm). Tentukan luas daerah bidang yang diarsir! (Daerah diarsir = luas persegi − luas lingkaran)",
          answerType: "long_text",
        },
        {
          id: "lkm3-b4-q4",
          type: "question",
          content:
            "Berdasarkan gambar di atas, buatlah sebuah contoh soal cerita tentang kehidupan sehari-hari yang berkaitan dengan luas bidang datar! Berikan penyelesaiannya!",
          answerType: "long_text",
        },
        {
          id: "lkm3-b4-q5",
          type: "question",
          content:
            "Sebuah lapangan berbentuk jajar genjang. Keliling lapangan 120 m. Pada salah satu sisi sawah tersebut pinggirannya ditanami pohon mangga sebanyak 8 buah. Jarak setiap pohon mangga yang satu ke yang lainnya adalah 6 m. Hitunglah luas lapangan tersebut!",
          answerType: "long_text",
        },
        {
          id: "lkm3-b4-q6-img",
          type: "image",
          content: "Persegi DEFG dengan titik tengah H, I, J, K",
          imageSrc: "/assets/lkm/gambar/pr-soal6-persegi-DEFG-HIJK.png",
          imageAlt: "Persegi DEFG dengan H, I, J, K sebagai titik tengah sisi-sisinya",
        },
        {
          id: "lkm3-b4-q6",
          type: "question",
          content:
            "Misalkan DEFG merupakan sebuah persegi, dan H, I, J dan K berturut-turut merupakan titik tengah DE, EF, FG, dan DG.\n• Buatlah gambar persegi tersebut!\n• Berapa bagian luas persegi HIJK dibanding luas persegi DEFG?",
          answerType: "long_text",
        },
      ],
    },
  ],
  reflectionPrompt: "Tuliskan pengalaman belajar Anda dalam mengerjakan LKM 3 ini. Apa perbedaan antara konsep keliling dan luas yang Anda pahami sekarang?",
};

// ─────────────────────────────────────────
// LKM 4 — Simetri, Pengubinan, Koordinat, Pencerminan
// ─────────────────────────────────────────
const lkm4: LKMContent = {
  lkmNumber: 4,
  title: "LKM 4 — Simetri, Pengubinan, Sistem Koordinat dan Pencerminan",
  topic: "Simetri, Pengubinan, Sistem Koordinat dan Pencerminan",
  focusTitle: "SIMETRI, PENGUBINAN, SISTEM KOORDINAT DAN PENCERMINAN",
  estimatedMinutes: 150,
  courseCode: "GD309",
  courseName: "Pendalaman Materi Matematika SD",
  courseCredits: "3 SKS",
  instructions: [
    "Baca dengan teliti naskah yang diterima.",
    "Gunakan tempat yang telah disediakan untuk menjawab pertanyaan-pertanyaan yang diberikan.",
    "P melambangkan singkatan dari kata pertanyaan, pernyataan atau perintah. J singkatan dari kata jawaban.",
  ],
  sections: [
    {
      id: "lkm4-bagian1",
      title: "Bagian 1",
      phase: "Concrete",
      items: [
        {
          id: "lkm4-b1-img1",
          type: "image",
          content: "Gambar 1. Surat dan Amplopnya",
          imageSrc: "/assets/lkm/lkm-4/image-01.png",
          imageAlt: "Gambar 1. Surat dan Amplopnya — konteks simetri",
        },
        {
          id: "lkm4-b1-img2",
          type: "image",
          content: "Gambar 2. Kincir Angin",
          imageSrc: "/assets/lkm/lkm-4/image-02.png",
          imageAlt: "Gambar 2. Kincir Angin — konteks simetri putar",
        },
        {
          id: "lkm4-b1-img3",
          type: "image",
          content: "Gambar 3. Paving Block",
          imageSrc: "/assets/lkm/lkm-4/image-03.png",
          imageAlt: "Gambar 3. Paving Block — konteks pengubinan",
        },
        {
          id: "lkm4-b1-img4",
          type: "image",
          content: "Gambar 4. Cermin dan Benda",
          imageSrc: "/assets/lkm/lkm-4/image-04.png",
          imageAlt: "Gambar 4. Cermin dan Benda — konteks pencerminan",
        },
        {
          id: "lkm4-b1-p1",
          type: "prompt",
          content:
            "Berdasarkan keempat gambar di atas, coba pikirkan dan tuliskan berbagai contoh permasalahan dalam keseharian terkait dengan penerapan konsep simetri (lipat dan putar), pengubinan, sistem koordinat dan pencerminan!",
          answerType: "long_text",
        },
        {
          id: "lkm4-b1-p2",
          type: "prompt",
          content:
            "Tuliskan berbagai cara penyelesaian yang dapat Anda gunakan untuk memecahkan berbagai masalah dalam keseharian yang telah Anda tuliskan sebelumnya!",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm4-bagian2",
      title: "Bagian 2",
      phase: "Pictorial",
      items: [
        {
          id: "lkm4-b2-p1",
          type: "prompt",
          content: "Gambarkan bentuk bidang datar dari berbagai gambar benda dalam keseharian tersebut di atas!",
          answerType: "drawing",
        },
        {
          id: "lkm4-b2-p2",
          type: "prompt",
          content:
            "Buatlah bidang-bidang datar yang telah digambarkan dengan menggunakan kertas lipat yang telah disediakan! Kemudian hitung berapa banyak simetri lipat dan simetri putar dari bidang-bidang datar yang digambarkan!",
          answerType: "long_text",
        },
        {
          id: "lkm4-b2-p3-img",
          type: "image",
          content: "Koordinat arah angin",
          imageSrc: "/assets/lkm/gambar/soal-b2-koordinat-arah-angin.png",
          imageAlt: "Empat arah mata angin dalam koordinat Cartesius",
        },
        {
          id: "lkm4-b2-p3",
          type: "prompt",
          content:
            "Perhatikan Gambar 2, jika salah satu bagian kincir angin tersebut menunjukkan arah utara maka ketiga bagian yang lain menunjukkan arah apa sajakah? Gambarkan keempat arah mata angin tersebut dalam koordinat Cartesius!",
          answerType: "drawing",
        },
        {
          id: "lkm4-b2-p4",
          type: "prompt",
          content:
            "Sebuah kapal berlayar dari arah utara berniat menuju sebuah pelabuhan di arah barat daya, akan tetapi di perjalanan dihempas badai sehingga kapal tersebut berputar dari arah utara berlawanan arah jarum jam sebesar 270°. Tentukan arah keberadaan kapal sekarang?",
          answerType: "long_text",
        },
        {
          id: "lkm4-b2-p5-img",
          type: "image",
          content: "Gambar 5. Peta Jalan dengan gedung A–I",
          imageSrc: "/assets/lkm/gambar/Gambar 5 LKM 4.png",
          imageAlt: "Peta jalan dengan gedung-gedung A sampai I berlabel",
        },
        {
          id: "lkm4-b2-p5",
          type: "question",
          content:
            "Perhatikan Gambar 5 (peta jalan dengan gedung-gedung A–I). Fathiyyah keluar dari gedung B dan bergerak dengan urutan: ke luar gedung menuju Jalan B.J. Habibie kemudian ke timur, pada persimpangan pertama belok kiri ke utara, lalu pada persimpangan kedua berbelok ke kanan arah barat, selanjutnya pada persimpangan ke tiga bergerak ke arah utara. Gedung apakah yang ingin dituju Fathiyyah? Berikan penjelasan dengan menggunakan gambar!",
          answerType: "drawing",
        },
        {
          id: "lkm4-b2-p6",
          type: "prompt",
          content:
            "Perhatikan Gambar 3. Jika jalan tersebut berbentuk persegi dengan luas 36 m², maka berapa banyak paving blok berbentuk segitiga siku-siku yang mempunyai ukuran alas 1 m dan tinggi 1 m yang dibutuhkan untuk menutupi jalan tersebut?",
          answerType: "long_text",
        },
        {
          id: "lkm4-b2-p7",
          type: "prompt",
          content:
            "Ibu Faizah merencanakan menutup lantai ruang tamu di rumahnya yang berbentuk persegi panjang dengan ubin keramik. Jika ubin itu berbentuk persegi dengan ukuran sisinya 30 cm dan luas lantai ruang tamu ibu Faizah adalah 9 m², dapatkah pengubinan dilaksanakan? Berapakah ubin yang diperlukan? Gambarkan sketsa pengubinan tersebut!",
          answerType: "drawing",
        },
        {
          id: "lkm4-b2-p8",
          type: "prompt",
          content:
            "Perhatikan jarak setiap benda pada cermin dengan jarak benda pada keadaan sebenarnya. Apa yang terjadi?",
          answerType: "long_text",
        },
        {
          id: "lkm4-b2-p9-img",
          type: "image",
          content: "Pencerminan segitiga ABC",
          imageSrc: "/assets/lkm/gambar/soal-b2-pencerminan-segitiga-abc.png",
          imageAlt: "Segitiga ABC pada bidang koordinat untuk dicerminkan terhadap sumbu X",
        },
        {
          id: "lkm4-b2-p9",
          type: "prompt",
          content:
            "Sebuah segitiga ABC dengan A (−3, 1), B (1, 4) dan C (2, 1). Jika segitiga ABC tersebut dicerminkan terhadap sumbu X dalam sistem koordinat Cartesius, gambarkan bayangannya!",
          answerType: "drawing",
        },
      ],
    },
    {
      id: "lkm4-bagian3",
      title: "Bagian 3",
      phase: "Abstract",
      items: [
        {
          id: "lkm4-b3-p1-img",
          type: "image",
          content: "Gambar (a), (b), (c), (d) — kongruensi",
          imageSrc: "/assets/lkm/gambar/soal-b3-kongruensi-abcd.png",
          imageAlt: "Empat bidang datar (a), (b), (c), (d) untuk dicari pasangan kongruen",
        },
        {
          id: "lkm4-b3-p1",
          type: "prompt",
          content: "Dari gambar (a), (b), (c), (d) yang diberikan, tentukan pasangan dua gambar yang kongruen! Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm4-b3-p2-img",
          type: "image",
          content: "Gambar untuk rotasi 270° searah jarum jam",
          imageSrc: "/assets/lkm/gambar/soal-b3-rotasi-270-searah-jarum.png",
          imageAlt: "Bidang datar yang perlu dirotasi 270° searah jarum jam",
        },
        {
          id: "lkm4-b3-p2",
          type: "prompt",
          content:
            "Jika gambar di samping dirotasikan sejauh 270° searah jarum jam, buatlah gambar hasil rotasinya!",
          answerType: "drawing",
        },
        {
          id: "lkm4-b3-p3",
          type: "prompt",
          content: "Dapatkah kita melaksanakan pengubinan dengan bangun segi 7 beraturan? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm4-b3-p4",
          type: "prompt",
          content: "Bagaimanakah bentuk dan ukuran dari bayangan suatu benda yang berada di depan cermin?",
          answerType: "long_text",
        },
        {
          id: "lkm4-b3-p5",
          type: "prompt",
          content:
            "Berdasarkan LKM 4 Bagian 1 dan Bagian 2. Buatlah sebuah kesimpulan tentang pengertian dari simetri (lipat dan putar), pengubinan, dan pencerminan!",
          answerType: "long_text",
        },
      ],
    },
  ],
  reflectionPrompt: "Tuliskan pengalaman belajar Anda dalam mengerjakan LKM 4 ini. Konsep mana yang paling menarik dan mengapa?",
};

// ─────────────────────────────────────────
// LKM 5 — Bangun Ruang Sederhana
// ─────────────────────────────────────────
const lkm5: LKMContent = {
  lkmNumber: 5,
  title: "LKM 5 — Bangun-bangun Ruang Sederhana",
  topic: "Bangun-bangun Ruang Sederhana",
  focusTitle: "BANGUN-BANGUN RUANG SEDERHANA (BALOK, KUBUS, PRISMA, LIMAS, TABUNG, KERUCUT DAN BOLA)",
  estimatedMinutes: 150,
  courseCode: "GD309",
  courseName: "Pendalaman Materi Matematika SD",
  courseCredits: "3 SKS",
  instructions: [
    "Baca dengan teliti naskah yang diterima.",
    "Gunakan tempat yang telah disediakan untuk menjawab pertanyaan-pertanyaan yang diberi.",
    "P melambangkan singkatan dari kata pertanyaan, pernyataan atau perintah. J singkatan dari kata jawaban.",
  ],
  sections: [
    {
      id: "lkm5-bagian1",
      title: "Bagian 1",
      phase: "Concrete",
      items: [
        {
          id: "lkm5-b1-p1",
          type: "prompt",
          content:
            "Perhatikan lingkungan sekitar Anda. Tuliskan empat benda dalam kehidupan sehari-hari yang berbentuk kubus dan empat benda berbentuk bangun ruang lainnya (balok, prisma, limas, tabung, kerucut, bola)!",
          answerType: "long_text",
        },
        {
          id: "lkm5-b1-sm1",
          type: "note",
          content: "Situasi Masalah Ke-1",
        },
        {
          id: "lkm5-b1-sm1-q",
          type: "question",
          content:
            "Fatimah adalah Siswa SD Kelas 5. Dia mendapatkan tugas dari gurunya untuk menyelidiki berapa banyak bentuk jaring-jaring balok yang dapat dibuat dari sebuah kotak bekas pasta gigi.\n• Apa yang Anda lakukan dengan kotak bekas pasta gigi yang dimiliki oleh Fatimah?\n• Bentuk-bentuk jaring-jaring balok apa saja yang dapat Anda buatkan untuk Fatimah?",
          answerType: "long_text",
        },
        {
          id: "lkm5-b1-sm2",
          type: "note",
          content: "Situasi Masalah Ke-2",
        },
        {
          id: "lkm5-b1-sm2-q",
          type: "question",
          content:
            "Dari 20 buah kubus satuan, buatlah sebuah bangun dengan ketentuan:\n• Susun 12 kubus satuan dengan panjang 4 satuan dan lebar 3 satuan.\n• Di tingkatan kedua: 3 kubus satuan di barisan pertama, 2 kubus satuan di barisan kedua.\n• Di tingkatan ketiga: 2 kubus satuan di barisan pertama, 1 kubus satuan di barisan kedua.\n\nAmati bangun yang terbentuk. Buatlah gambar representasi dua dimensi jika bangun dilihat dari atas, bawah, samping kanan, dan samping kiri!",
          answerType: "drawing",
        },
      ],
    },
    {
      id: "lkm5-bagian2",
      title: "Bagian 2",
      phase: "Pictorial",
      items: [
        {
          id: "lkm5-b2-p1",
          type: "prompt",
          content:
            "Gambarkan bentuk bangun ruang (balok, kubus, prisma, limas, kerucut, tabung dan bola) dari hasil eksplorasi kegiatan sebelumnya. Berikan nama pada setiap titik sudutnya dengan menggunakan huruf kapital!",
          answerType: "drawing",
        },
        {
          id: "lkm5-b2-tabel",
          type: "table",
          content:
            "Tuliskan nama setiap titik sudut, rusuk, sisi, diagonal bidang, dan diagonal ruang dari gambar bangun-bangun ruang di atas pada tabel di bawah ini!",
          answerType: "table",
          tableHeaders: ["Nama Bangun Ruang", "Titik Sudut", "Rusuk", "Sisi", "Diagonal Bidang", "Diagonal Ruang"],
          tableRows: 7,
        },
        {
          id: "lkm5-b2-sm3",
          type: "note",
          content: "Situasi Masalah Ke-3",
        },
        {
          id: "lkm5-b2-img1",
          type: "image",
          content: "Gambar 1. Kubus Satuan dan Susunannya",
          imageSrc: "/assets/lkm/lkm-5/kubus-satuan.png",
          imageAlt: "Gambar 1. Kubus satuan dalam susunan bangun ruang — tampak dari berbagai sudut",
        },
        {
          id: "lkm5-b2-sm3-q",
          type: "question",
          content:
            "Buatlah sketsa gambar dari bangun kubus di atas dengan membangun model representasi dua dimensi, jika dilihat dari berbagai sudut pandang (dari bagian atas, depan, dan samping)!",
          answerType: "drawing",
        },
        {
          id: "lkm5-b2-sm4",
          type: "note",
          content: "Situasi Masalah Ke-4",
        },
        {
          id: "lkm5-b2-sm4-img",
          type: "image",
          content: "Jaring-jaring balok",
          imageSrc: "/assets/lkm/gambar/SM 4 LKM 5.png",
          imageAlt: "Jaring-jaring balok yang perlu dilipat menjadi balok",
        },
        {
          id: "lkm5-b2-sm4-q",
          type: "question",
          content: "Buatlah gambar balok dari jaring-jaring yang diberikan oleh dosen!",
          answerType: "drawing",
        },
      ],
    },
    {
      id: "lkm5-bagian3",
      title: "Bagian 3",
      phase: "Abstract",
      items: [
        {
          id: "lkm5-b3-p1",
          type: "prompt",
          content: "Jika Anda membuat sebuah kubus, mungkinkah ukuran setiap sisi dari kubus tersebut berbeda satu dengan yang lainnya? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm5-b3-p2",
          type: "prompt",
          content: "Mungkinkah sebuah prisma berbentuk balok? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm5-b3-p3",
          type: "prompt",
          content: "Mungkinkah alas dari sebuah tabung berbentuk segitiga? Mengapa?",
          answerType: "long_text",
        },
        {
          id: "lkm5-b3-p4",
          type: "prompt",
          content: "Mungkinkah sebuah limas memiliki sisi alas dan sisi atas? Jelaskan!",
          answerType: "long_text",
        },
        {
          id: "lkm5-b3-p5",
          type: "prompt",
          content: "Bagaimana cara memberi nama sebuah prisma atau sebuah limas?",
          answerType: "long_text",
        },
        {
          id: "lkm5-b3-p6",
          type: "prompt",
          content: "Mungkinkah sebuah balok memiliki lebih dari lima macam bentuk jaring-jaring?",
          answerType: "long_text",
        },
        {
          id: "lkm5-b3-p7",
          type: "prompt",
          content: "Jelaskan apa yang dimaksud dengan jaring-jaring pada kubus?",
          answerType: "long_text",
        },
        {
          id: "lkm5-b3-tabel",
          type: "table",
          content: "Tuliskan rangkuman dalam bentuk tabel tentang ciri-ciri (sifat-sifat) dari kubus, balok, prisma, limas, tabung, kerucut dan bola.",
          answerType: "table",
          tableHeaders: ["Bangun Ruang", "Jumlah Sisi", "Jumlah Rusuk", "Jumlah Titik Sudut", "Ciri Khas"],
          tableRows: 7,
        },
      ],
    },
  ],
  reflectionPrompt: "Tuliskan pengalaman belajar Anda dalam mengerjakan LKM 5 ini. Apa perbedaan utama antara bangun ruang yang beralas datar dan yang tidak?",
};

// ─────────────────────────────────────────
// LKM 6 — Volume Bangun Ruang
// ─────────────────────────────────────────
const lkm6: LKMContent = {
  lkmNumber: 6,
  title: "LKM 6 — Volume Bangun-bangun Ruang Sederhana",
  topic: "Bangun-bangun Ruang Sederhana",
  focusTitle: "VOLUME BANGUN-BANGUN RUANG SEDERHANA (BALOK, KUBUS, PRISMA, LIMAS, TABUNG, KERUCUT DAN BOLA)",
  estimatedMinutes: 150,
  courseCode: "GD309",
  courseName: "Pendalaman Materi Matematika SD",
  courseCredits: "3 SKS",
  instructions: [
    "Baca dengan teliti naskah yang diterima.",
    "Gunakan tempat yang telah disediakan untuk menjawab pertanyaan-pertanyaan yang diberi.",
    "P melambangkan singkatan dari kata pertanyaan, pernyataan atau perintah. J singkatan dari kata jawaban.",
  ],
  sections: [
    {
      id: "lkm6-bagian1",
      title: "Bagian 1 — Menemukan Rumus Volume",
      phase: "Concrete",
      items: [
        {
          id: "lkm6-b1-kubus-tabel",
          type: "table",
          content: "VOLUME KUBUS (Kelompok I) — Media: Kubus satuan.\n\nTuliskan empat benda dalam kehidupan sehari-hari yang berbentuk kubus, kemudian lengkapi tabel berikut ini!",
          answerType: "table",
          tableHeaders: ["No.", "Nama Benda", "Panjang Rusuk (cm)", "Volume (cm³)"],
          tableRows: 4,
        },
        {
          id: "lkm6-b1-kubus-sketsa",
          type: "prompt",
          content: "Gambarkan benda-benda tersebut dalam bentuk sketsa bangun kubus dengan ukuran rusuk yang telah dituliskan pada tabel!",
          answerType: "drawing",
        },
        {
          id: "lkm6-b1-kubus-hitung",
          type: "prompt",
          content:
            "Berdasarkan tabel yang telah dilengkapi, selesaikan:\n1. Jika panjang rusuk = ......... cm, maka volume = ......... × ......... × ......... = ......... cm³\n2. Jika panjang rusuk = ......... cm, maka volume = ......... × ......... × ......... = ......... cm³\n3. Jika panjang rusuk = ......... cm, maka volume = ......... × ......... × ......... = ......... cm³\n4. Jika panjang rusuk = ......... cm, maka volume = ......... × ......... × ......... = ......... cm³\n\nMisalkan panjang rusuk suatu kubus a cm dan volume kubus dilambangkan dengan V, maka V = .............",
          answerType: "long_text",
        },
        {
          id: "lkm6-b1-balok-tabel",
          type: "table",
          content: "VOLUME BALOK (Kelompok II) — Media: Kubus satuan.\n\nTuliskan empat benda dalam kehidupan sehari-hari yang berbentuk balok, kemudian lengkapi tabel berikut ini!",
          answerType: "table",
          tableHeaders: ["No.", "Nama Benda", "Panjang (cm)", "Lebar (cm)", "Tinggi (cm)", "Volume (cm³)"],
          tableRows: 4,
        },
        {
          id: "lkm6-b1-balok-hitung",
          type: "prompt",
          content:
            "Berdasarkan tabel, selesaikan perhitungan volume balok. Misalkan panjang, lebar dan tinggi suatu balok berturut-turut adalah a, b dan c dan volume balok dilambangkan dengan V, maka V = .............",
          answerType: "long_text",
        },
        {
          id: "lkm6-b1-prisma-tabel",
          type: "table",
          content: "VOLUME PRISMA SEGITIGA (Kelompok III)\n\nTuliskan empat benda berbentuk prisma segitiga dalam kehidupan sehari-hari, kemudian lengkapi tabel!",
          answerType: "table",
          tableHeaders: ["No.", "Nama Benda", "Luas Alas (cm²)", "Tinggi (cm)", "Volume (cm³)"],
          tableRows: 4,
        },
        {
          id: "lkm6-b1-prisma-rumus",
          type: "prompt",
          content: "Misalkan panjang rusuk alas suatu prisma segitiga sama sisi a cm, tinggi prisma t cm, dan volume dilambangkan dengan V, maka V = .............",
          answerType: "long_text",
        },
        {
          id: "lkm6-b1-limas-tabel",
          type: "table",
          content:
            "VOLUME LIMAS SEGIEMPAT (Kelompok IV)\n\nBuatlah 2 kubus dari karton. Dari setiap 1 kubus buatlah 6 limas (alas = sisi kubus, tinggi limas = ½ rusuk kubus). Masukkan 6 limas ke dalam kubus. Apa yang terjadi? Lengkapi tabel!",
          answerType: "table",
          tableHeaders: ["No.", "Nama Benda", "Luas Alas (cm²)", "Tinggi (cm)", "Volume Limas = ...... × Volume Kubus (cm³)"],
          tableRows: 2,
        },
        {
          id: "lkm6-b1-limas-rumus",
          type: "prompt",
          content: "Misalkan suatu limas memiliki alas berbentuk persegi dengan ukuran a cm, tinggi limas t cm, dan volume limas dilambangkan dengan V, maka V = .............",
          answerType: "long_text",
        },
        {
          id: "lkm6-b1-tabung-tabel",
          type: "table",
          content: "VOLUME TABUNG (Kelompok V)\n\nTuliskan empat benda berbentuk tabung dalam kehidupan sehari-hari, kemudian lengkapi tabel!",
          answerType: "table",
          tableHeaders: ["No.", "Nama Benda", "Jari-jari (cm)", "Luas Alas (cm²)", "Tinggi (cm)", "Volume (cm³)"],
          tableRows: 4,
        },
        {
          id: "lkm6-b1-tabung-rumus",
          type: "prompt",
          content: "Misalkan suatu tabung memiliki jari-jari a cm, tinggi t cm, dan volume dilambangkan dengan V, maka V = .............",
          answerType: "long_text",
        },
        {
          id: "lkm6-b1-kerucut-tabel",
          type: "table",
          content:
            "VOLUME KERUCUT (Kelompok VI)\n\nBuatlah 2 pasangan tabung dan kerucut yang memiliki ukuran diameter alas dan tinggi yang sama. Isi kerucut dengan tepung/beras/pasir, tuangkan ke tabung pasangannya. Lakukan berulang sampai tabung penuh. Lengkapi tabel!",
          answerType: "table",
          tableHeaders: ["No.", "Nama Benda", "Jari-jari (cm)", "Luas Alas (cm²)", "Tinggi (cm)", "Volume Kerucut = ...... × Volume Tabung (cm³)"],
          tableRows: 2,
        },
        {
          id: "lkm6-b1-kerucut-rumus",
          type: "prompt",
          content: "Misalkan suatu kerucut memiliki jari-jari a cm, tinggi t cm, dan volume dilambangkan dengan V, maka V = .............",
          answerType: "long_text",
        },
        {
          id: "lkm6-b1-bola-tabel",
          type: "table",
          content:
            "VOLUME BOLA (Kelompok VII)\n\nBuatlah 2 kerucut (diameter alas dan tinggi = diameter dan tinggi ½ bola). Isi kerucut, tuangkan ke dalam ½ bola. Lakukan sampai ½ bola penuh. Apa yang terjadi? Lengkapi tabel!",
          answerType: "table",
          tableHeaders: ["No.", "Nama Benda", "Jari-jari (cm)", "Luas Alas (cm²)", "Tinggi (cm)", "Volume ½ Bola = ...... × Volume Kerucut (cm³)"],
          tableRows: 2,
        },
        {
          id: "lkm6-b1-bola-rumus",
          type: "prompt",
          content: "Misalkan suatu bola memiliki jari-jari a cm dan volume dilambangkan dengan V, maka V = .............",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm6-bagian2",
      title: "Bagian 2 — Pemecahan Masalah (Semua Kelompok)",
      phase: "Abstract",
      items: [
        {
          id: "lkm6-b2-sm1",
          type: "note",
          content: "Situasi Masalah Ke-1",
        },
        {
          id: "lkm6-b2-sm1-img",
          type: "image",
          content: "Bidang diagonal dalam kubus",
          imageSrc: "/assets/lkm/gambar/soal-sm1-bidang-diagonal-kubus.png",
          imageAlt: "Papan menyerupai bidang diagonal di dalam kubus",
        },
        {
          id: "lkm6-b2-sm1-q",
          type: "question",
          content:
            "Misalkan sebuah papan dimasukkan ke dalam kotak berbentuk kubus dengan panjang rusuk 10 m. Letak papan di dalam kotak menyerupai bidang diagonal.\na. Buatlah sketsa gambar dari situasi masalah ini!\nb. Hitunglah luas permukaan papan dalam satuan cm²!",
          answerType: "long_text",
        },
        {
          id: "lkm6-b2-sm2",
          type: "note",
          content: "Situasi Masalah Ke-2",
        },
        {
          id: "lkm6-b2-sm2-img",
          type: "image",
          content: "Tangki air",
          imageSrc: "/assets/lkm/gambar/soal-sm2-tangki-air.png",
          imageAlt: "Tangki air yang terisi setengah",
        },
        {
          id: "lkm6-b2-sm2-q",
          type: "question",
          content:
            "Diketahui sebuah tangki air terisi setengahnya. Jika terisi lagi dengan 15 liter, maka isi tangki tersebut akan menjadi tigaperempatnya.\n• Buatlah sketsa gambar dari situasi masalah ini!\n• Berapa liter kapasitas tangki tersebut?",
          answerType: "long_text",
        },
        {
          id: "lkm6-b2-sm3",
          type: "note",
          content: "Situasi Masalah Ke-3",
        },
        {
          id: "lkm6-b2-sm3-q",
          type: "question",
          content:
            "Sebuah bak penampungan air memiliki kapasitas isi 6.000 dm³. Untuk mengisi airnya direncanakan menggunakan dua selang. Jika setiap selang mengalirkan air 2 m³ tiap menit, berapakah waktu yang diperlukan untuk mengisinya sampai penuh?",
          answerType: "long_text",
        },
        {
          id: "lkm6-b2-sm4",
          type: "note",
          content: "Situasi Masalah Ke-4",
        },
        {
          id: "lkm6-b2-sm4-q",
          type: "question",
          content:
            "Sebuah bak mempunyai panjang 3 meter lebihnya dari lebar bak tersebut, sedangkan lebarnya 2 meter kurangnya dari tinggi bak. Bila luas alas bak tersebut 16 m². Berapakah isi bak mandi tersebut?",
          answerType: "long_text",
        },
        {
          id: "lkm6-b2-sm5",
          type: "note",
          content: "Situasi Masalah Ke-5",
        },
        {
          id: "lkm6-b2-sm5-q",
          type: "question",
          content:
            "Seribu kilometer di atas permukaan planet Jupiter di suatu orbit melintas sebuah satelit buatan. Waktu yang dibutuhkan satelit untuk melintasi satu kali orbit adalah dua ratus empat puluh menit. Jika planet tersebut memiliki diameter dua belas ribu delapan ratus kilometer, hitunglah kecepatan rata-rata satelit tersebut dalam km/jam! (π = 3,14)",
          answerType: "long_text",
        },
      ],
    },
    {
      id: "lkm6-bagian3",
      title: "Bagian 3 — Pembuktian Keterkaitan Rumus",
      phase: "Abstract",
      items: [
        {
          id: "lkm6-b3-p1",
          type: "prompt",
          content: "Apakah terdapat keterkaitan antara volume kubus dengan volume limas? Jelaskan dengan rinci! Buatlah pembuktian rumusnya!",
          answerType: "long_text",
        },
        {
          id: "lkm6-b3-p2",
          type: "prompt",
          content: "Apakah terdapat keterkaitan antara volume balok dan volume kubus? Jelaskan secara rinci! Buatlah pembuktian rumusnya!",
          answerType: "long_text",
        },
        {
          id: "lkm6-b3-p3",
          type: "prompt",
          content: "Apakah terdapat keterkaitan antara volume tabung dan volume kerucut? Jelaskan secara rinci! Buatlah pembuktian rumusnya!",
          answerType: "long_text",
        },
        {
          id: "lkm6-b3-p4",
          type: "prompt",
          content: "Apakah terdapat keterkaitan antara volume bola dan volume kerucut? Jelaskan secara rinci! Buatlah pembuktian rumusnya!",
          answerType: "long_text",
        },
      ],
    },
  ],
  reflectionPrompt: "Tuliskan pengalaman belajar Anda dalam mengerjakan LKM 6 ini. Bagaimana cara menemukan rumus volume melalui percobaan langsung membantu pemahaman Anda?",
};

// ─────────────────────────────────────────
// Export
// ─────────────────────────────────────────
export const lkmContents: LKMContent[] = [lkm1, lkm2, lkm3, lkm4, lkm5, lkm6];

export default lkmContents;

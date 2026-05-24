# Revisi Sistem LKM Matematika PGSD

## Tujuan

Menyempurnakan sistem KAM, Pre Test, Post Test, LKM 1-6, modul remedial, dan feedback dosen agar sesuai kebutuhan pembelajaran matematika geometri PGSD.

## Masalah project saat ini

1. Data soal masih dummy.
2. Materi masih Operasi Aljabar, Persamaan Linear, dan Pemecahan Masalah Matematis.
3. LKM baru 1-3 dan masih memakai skor otomatis.
4. LKM belum sesuai RPS LKM 1-6.
5. Feedback dosen per LKM belum tersedia secara khusus.
6. Soal Pre/Post Test bergambar belum didukung oleh field dan asset yang jelas.
7. Pre Test berisiko membocorkan kunci jawaban lewat API/loader karena question bisa berisi correctAnswer dan explanation.
8. Modul remedial PDF belum terhubung sebagai bahan belajar untuk mahasiswa yang tidak lulus KAM.
9. Format matematika belum rapi, misalnya cm2, m3, satuan2, 90o, dan 180o.

## Target revisi

1. Ganti soal KAM dengan soal asli.
2. Ganti soal Pre/Post Test dengan soal asli.
3. Tambahkan pembahasan Post Test.
4. Tambahkan dukungan gambar soal.
5. Tambahkan LKM 1 sampai LKM 6.
6. Hilangkan skor otomatis pada LKM.
7. Tambahkan feedback dosen per LKM.
8. Tambahkan modul remedial PDF.
9. Amankan response Pre Test untuk mahasiswa.
10. Rapikan format matematika.

## File sumber yang tersedia

Semua file sumber ada di `docs/source/`:

- `SOAL TES KAM DAN KUNCI JAWABAN SIAP NAIK WEB.docx`
- `PRE- POST TEST SOAL KEMAMPUAN GEOMETRI.docx`
- `Jawban dan Pembahasan untuk di tunjukan saat Post test.docx`
- `RPS dan LKM 1 Siap Naik Web.docx`
- `RPS dan LKM 2 Siap Naik Web.docx`
- `RPS dan LKM 3 Siap Naik Web.docx`
- `RPS dan LKM 4 Siap Naik Web.docx`
- `RPS dan LKM 5 Siap Naik Web.docx`
- `RPS dan LKM 6 Siap Naik Web.docx`
- `PGSD-MODUL 2- Matematika-gabungan.pdf`

## Urutan pengerjaan yang disarankan di Kiro

1. Audit schema dan data dummy.
2. Tambahkan field pendukung soal gambar dan nomor soal.
3. Amankan API/loader Pre Test.
4. Perbaiki data soal KAM.
5. Perbaiki data soal Pre/Post Test.
6. Tambahkan pembahasan Post Test.
7. Tambahkan asset gambar soal.
8. Ubah LKM menjadi non-skor.
9. Tambahkan LKM 1 sampai LKM 6.
10. Tambahkan feedback dosen per LKM.
11. Tambahkan modul remedial PDF.
12. Final testing.

## Catatan schema awal

Model `Question` disarankan memiliki field tambahan:

```prisma
questionNumber Int?
questionImage  String?
imageAlt       String?
```

Model `LKM` disarankan memiliki field tambahan:

```prisma
sections Json?
estimatedMinutes Int?
```

Alur LKM tidak boleh memakai skor. Jika field `score` tetap dipertahankan untuk kompatibilitas database, jangan isi dan jangan tampilkan di UI.

Disarankan menambah model khusus feedback dosen:

```prisma
model LecturerLKMFeedback {
  id           String   @id @default(cuid())
  studentId    String
  teacherId    String
  lkmId        String
  feedbackText String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  student Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  teacher Teacher @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  lkm     LKM     @relation(fields: [lkmId], references: [id], onDelete: Cascade)

  @@unique([studentId, teacherId, lkmId])
}
```

Jika nama relasi konflik, sesuaikan dengan gaya schema yang sudah ada.

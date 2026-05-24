# README — Paket Kiro Ready: Sistem LKM Matematika PGSD

Dokumen ini menjelaskan isi paket zip dan cara menggunakannya bersama Kiro.

## Status Paket

| Komponen | Status |
|---|---|
| Source code Next.js | ✅ Bersih (tanpa node_modules, .next, .env) |
| Gambar soal nomor 2, 3, 4, 6, 10 | ✅ Gambar ASLI tersedia (bukan placeholder) |
| Modul PDF remedial | ✅ Tersedia di `public/modules/` dan `docs/source/` |
| LKM 1–6 docx | ✅ Versi final tersedia di `docs/source/` |
| Soal KAM + kunci | ✅ Tersedia di `docs/source/` |
| Pre/Post Test soal + pembahasan | ✅ Tersedia di `docs/source/` |
| AGENTS.md | ✅ Aturan lengkap tersedia |
| KIRO_EXECUTION_PROMPTS.md | ✅ Prompt eksekusi bertahap tersedia |
| Dokumentasi teknis | ✅ Tersedia di `docs/` |

## Cara Membuka di Kiro

1. Extract zip ini di folder kerja Anda
2. Buka folder `MTK_KIRO_READY` di Kiro
3. Buka `KIRO_EXECUTION_PROMPTS.md` dan ikuti prompt secara bertahap
4. Gunakan `AGENTS.md` sebagai referensi aturan project

## Hal yang Masih Harus Dilakukan Kiro

Lihat `docs/data/revision-checklist.md` untuk checklist lengkap. Ringkasan:

1. **Ganti data dummy KAM** → gunakan `docs/source/SOAL TES KAM DAN KUNCI JAWABAN SIAP NAIK WEB.docx`
2. **Ganti data dummy Pre/Post Test** → gunakan `docs/source/PRE- POST TEST SOAL KEMAMPUAN GEOMETRI.docx`
3. **Tambahkan pembahasan Post Test** → gunakan `docs/source/Jawban dan Pembahasan untuk di tunjukan saat Post test.docx`
4. **Implementasi LKM 1–6 tanpa skor** → gunakan `docs/source/RPS dan LKM 1–6 Siap Naik Web.docx`
5. **Keamanan Pre Test** → hapus `correctAnswer` dari response API untuk mahasiswa
6. **Modul remedial** → tampilkan jika skor KAM < KKM (70)
7. **Format matematika** → normalisasi cm², m³, dm³, °
8. **Gambar soal** → gambar asli sudah tersedia, pastikan path di database/constants sesuai

## Struktur Project

```
MTK_KIRO_READY/
├── src/                     # Source code Next.js
│   ├── app/                 # App router (auth, student, teacher, api)
│   ├── components/          # UI components
│   └── lib/                 # Business logic, services
├── prisma/                  # Database schema & migrations
├── public/
│   ├── assets/questions/prepost/  # Gambar soal (5 gambar ASLI)
│   └── modules/             # PDF modul remedial
├── docs/
│   ├── source/              # Semua file sumber (docx, pdf)
│   ├── data/                # Question banks & revision docs
│   ├── questions/           # Image mapping
│   ├── requirements/        # Spesifikasi revisi
│   └── testing/             # Manual test guide
├── tests/                   # Unit & integration tests
├── AGENTS.md                # ⭐ Aturan project (baca dulu)
├── KIRO_EXECUTION_PROMPTS.md # ⭐ Prompt eksekusi bertahap
└── README_KIRO_READY.md     # File ini
```

## Gambar Soal — Detail

| File | Konten |
|---|---|
| prepost_q2.png | Daerah diarsir (segitiga dalam grid 3×3) |
| prepost_q3.png | Papan berkelok di dalam kubus 3D |
| prepost_q4.png | Segitiga siku-siku (3 cm, 4 cm, 13 cm) |
| prepost_q6.png | Dua persegi tumpang tindih, area arsiran di irisan |
| prepost_q10.png | Balok 30 dm × 2 dm × 100 dm |

Semua gambar tersedia di: `public/assets/questions/prepost/`

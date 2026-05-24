# Revision Checklist — Sistem LKM Matematika PGSD

Checklist ini digunakan Kiro untuk melacak progres implementasi revisi.

---

## A. Persiapan Awal

- [x] Project dibersihkan dari node_modules, .next, .env
- [x] AGENTS.md dibuat dengan aturan lengkap
- [x] Struktur docs/ dibuat
- [x] Semua file sumber di-copy ke docs/source/
- [x] Gambar soal ASLI disimpan di public/assets/questions/prepost/
- [x] PDF modul disimpan di public/modules/

---

## B. Revisi Data — KAM

- [ ] Soal KAM dummy diganti dengan soal asli dari `docs/source/SOAL TES KAM DAN KUNCI JAWABAN SIAP NAIK WEB.docx`
- [ ] Kunci jawaban KAM diperbarui
- [ ] KAM nomor 1: cm2 → cm²
- [ ] KAM nomor 9: 180o → 180°
- [ ] Review KAM hanya muncul setelah submit
- [ ] Modul remedial muncul jika skor < 70

---

## C. Revisi Data — Pre Test

- [ ] Soal Pre Test dummy diganti dengan soal asli dari `docs/source/PRE- POST TEST SOAL KEMAMPUAN GEOMETRI.docx`
- [ ] `correctAnswer` dan `explanation` TIDAK dikirim ke frontend untuk mahasiswa
- [ ] Pengecekan keamanan dilakukan di backend (bukan hanya frontend)
- [ ] Gambar soal nomor 2, 3, 4, 6, 10 terhubung dengan path yang benar
- [ ] Format matematika diperbarui (cm², m³, °, dsb.)

---

## D. Revisi Data — Post Test

- [ ] Soal Post Test dummy diganti (gunakan soal yang sama dengan Pre Test)
- [ ] Pembahasan ditambahkan dari `docs/source/Jawban dan Pembahasan untuk di tunjukan saat Post test.docx`
- [ ] Pembahasan hanya muncul setelah submit
- [ ] Gambar soal nomor 2, 3, 4, 6, 10 terhubung
- [ ] Review post test menampilkan: soal, opsi, jawaban mahasiswa, jawaban benar, status, pembahasan

---

## E. Revisi LKM

- [ ] LKM tidak memiliki skor
- [ ] LKM tidak memiliki status GRADED
- [ ] LKM 1: Segitiga, Segiempat, Lingkaran — referensi `docs/source/RPS dan LKM 1 Siap Naik Web.docx`
- [ ] LKM 2: Keliling bidang datar — referensi `docs/source/RPS dan LKM 2 Siap Naik Web.docx`
- [ ] LKM 3: Luas bidang datar — referensi `docs/source/RPS dan LKM 3 Siap Naik Web.docx`
- [ ] LKM 4: Simetri, Pengubinan, Koordinat, Pencerminan — referensi `docs/source/RPS dan LKM 4 Siap Naik Web.docx`
- [ ] LKM 5: Bangun ruang sederhana — referensi `docs/source/RPS dan LKM 5 Siap Naik Web.docx`
- [ ] LKM 6: Volume bangun ruang — referensi `docs/source/RPS dan LKM 6 Siap Naik Web.docx`
- [ ] Setiap LKM: Concrete → Pictorial → Abstract

---

## F. Feedback Dosen

- [ ] Halaman dosen: pilih mahasiswa → lihat LKM → beri feedback
- [ ] Feedback tersimpan per LKM per mahasiswa
- [ ] Mahasiswa dapat melihat feedback setelah disimpan

---

## G. Format Matematika

- [ ] cm2 → cm² (semua file)
- [ ] m2 → m²
- [ ] m3 → m³
- [ ] dm3 → dm³
- [ ] satuan2 → satuan²
- [ ] 90o/90O → 90°
- [ ] 180o/180O → 180°
- [ ] Titik desimal konsisten (7,38 bukan 7.38 atau "7, 38")

---

## H. Testing

- [ ] KAM: coba submit → cek review muncul → cek modul remedial jika skor < 70
- [ ] Pre Test: cek response API tidak mengandung correctAnswer
- [ ] Post Test: cek pembahasan muncul setelah submit
- [ ] LKM: cek tidak ada skor/graded di UI
- [ ] Gambar soal: cek semua 5 gambar tampil di nomor yang benar
- [ ] Feedback dosen: cek mahasiswa dapat membaca feedback

---

## Catatan Gambar Soal

Gambar ASLI sudah tersedia (bukan placeholder):

| File | Konten Visual |
|---|---|
| prepost_q2.png | Segitiga dalam grid — luas daerah diarsir |
| prepost_q3.png | Papan berkelok dalam kubus 3D |
| prepost_q4.png | Segitiga (3 cm, 4 cm, 13 cm) |
| prepost_q6.png | Dua persegi tumpang tindih, irisan diarsir |
| prepost_q10.png | Balok (30 dm × 2 dm × 100 dm) |

Pastikan path di constants/database menggunakan:
`/assets/questions/prepost/prepost_qN.png`

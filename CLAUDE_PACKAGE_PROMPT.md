# Prompt untuk Claude: Menyiapkan Zip Final untuk Kiro

Gunakan prompt ini ke Claude jika ingin Claude menyiapkan zip project yang rapi sebelum dibuka di Kiro.

```text
Saya akan mengirim project Next.js bernama MTK beserta file pendukung:
1. RPS dan LKM 1 sampai LKM 6 dalam format .docx
2. Gambar soal Pre/Post Test yang perlu dilengkapi
3. PDF modul remedial
4. File soal KAM, Pre/Post Test, dan pembahasan Post Test

Tugas Anda adalah menyiapkan paket zip final yang siap saya buka di Kiro, bukan mengimplementasikan semua fitur langsung.

Mohon lakukan hal berikut:

1. Bersihkan project dari file yang tidak perlu dikirim:
   - hapus node_modules/
   - hapus .next/
   - hapus .env
   - hapus dev-server.log
   - hapus dev-server.err.log
   - hapus tsconfig.tsbuildinfo
   - jangan hapus package.json, package-lock.json, prisma/, src/, public/, README.md, .env.example

2. Tambahkan file AGENTS.md di root project yang berisi aturan project:
   - KAM boleh review setelah submit
   - Pre Test tidak boleh membocorkan kunci jawaban
   - Post Test menampilkan pembahasan setelah submit
   - LKM 1-6 bukan tes dan tidak memakai skor
   - dosen memberi feedback per LKM
   - modul PDF digunakan sebagai remedial jika KAM tidak lulus
   - gambar soal Pre/Post nomor 2, 3, 4, 6, 10 harus didukung
   - format matematika harus rapi: cm², m², m³, dm³, satuan², 90°, 180°

3. Buat struktur folder dokumentasi:
   docs/source/
   docs/requirements/
   docs/data/
   docs/questions/
   docs/testing/

4. Masukkan semua file sumber ke docs/source/:
   - SOAL TES KAM DAN KUNCI JAWABAN SIAP NAIK WEB.docx
   - PRE- POST TEST SOAL KEMAMPUAN GEOMETRI.docx
   - Jawban dan Pembahasan untuk di tunjukan saat Post test.docx
   - RPS dan LKM 1 Siap Naik Web.docx
   - RPS dan LKM 2 Siap Naik Web.docx
   - RPS dan LKM 3 Siap Naik Web.docx
   - RPS dan LKM 4 Siap Naik Web.docx
   - RPS dan LKM 5 Siap Naik Web.docx
   - RPS dan LKM 6 Siap Naik Web.docx
   - PGSD-MODUL 2- Matematika-gabungan.pdf

5. Masukkan modul PDF juga ke:
   public/modules/PGSD-MODUL-2-Matematika-gabungan.pdf

6. Siapkan folder gambar soal:
   public/assets/questions/prepost/

7. Masukkan atau buat placeholder gambar:
   - prepost_q2.png
   - prepost_q3.png
   - prepost_q4.png
   - prepost_q6.png
   - prepost_q10.png

8. Buat dokumen berikut:
   - docs/requirements/revisi-sistem-lkm-mtk.md
   - docs/data/kam-question-bank.md
   - docs/data/prepost-question-bank.md
   - docs/data/posttest-explanations.md
   - docs/data/lkm-1-6-map.md
   - docs/data/revision-checklist.md
   - docs/questions/image-mapping.md
   - docs/testing/manual-test-lkm-mtk.md
   - KIRO_EXECUTION_PROMPTS.md
   - README_KIRO_READY.md

9. Isi dokumen dengan instruksi yang jelas agar Kiro memahami:
   - project saat ini masih berisi data dummy dan harus diganti
   - LKM tidak boleh berskor
   - Pre Test harus aman dari kebocoran kunci
   - Post Test boleh menampilkan pembahasan setelah submit
   - modul remedial muncul jika KAM tidak lulus
   - gambar soal harus dimapping sesuai nomor

10. Jangan ubah fitur utama project kecuali hanya menambahkan file panduan, sumber, asset, dan folder yang diperlukan.

11. Setelah selesai, berikan saya zip final dengan struktur project bersih.

12. Sertakan laporan:
   - file yang ditambahkan
   - file yang dibersihkan
   - folder sumber yang dibuat
   - catatan apa yang masih harus dilakukan oleh Kiro

Tujuan akhir: saya ingin membuka zip ini di Kiro dan langsung memakai prompt eksekusi bertahap untuk melanjutkan implementasi.
```

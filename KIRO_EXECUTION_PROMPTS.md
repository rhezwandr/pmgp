# Prompt Eksekusi Bertahap untuk Kiro

Gunakan prompt ini berurutan di Kiro. Jangan lompat langsung ke tahap akhir.

## Prompt 1 - Audit Project

```text
Baca AGENTS.md dan audit struktur project ini.

Jangan ubah kode dulu.

Tolong cari dan jelaskan:
1. Stack project: frontend, backend, database/ORM, auth, routing, lokasi asset/static file.
2. File/module yang menangani KAM, Pre Test, Post Test, LKM, hasil/review jawaban, pembahasan, gambar soal, role mahasiswa/dosen, database/model/schema, dan halaman dosen.
3. Flow sekarang untuk mahasiswa dan dosen.
4. Masalah yang terlihat dari audit: risiko Pre Test bocor kunci, gambar soal broken, LKM berskor, feedback dosen belum sesuai, modul remedial belum terhubung, format matematika belum rapi.

Output:
- ringkasan arsitektur,
- daftar file penting,
- daftar masalah,
- rekomendasi urutan implementasi.

Jangan melakukan perubahan kode.
```

## Prompt 2 - Buat Spec

```text
Berdasarkan AGENTS.md, docs/requirements/revisi-sistem-lkm-mtk.md, dan hasil audit, buat spec revisi sistem LKM Matematika.

Jangan implementasi kode dulu.

Spec harus berisi:
1. Requirements
2. Design
3. Implementation Tasks
4. Testing Plan
5. Risk Notes

Cakup fitur:
- KAM review setelah submit dan modul remedial jika tidak lulus.
- Pre Test tidak membocorkan kunci.
- Post Test menampilkan pembahasan setelah submit.
- Gambar Pre/Post nomor 2, 3, 4, 6, 10.
- Format matematika.
- LKM 1-6 tanpa skor.
- Feedback dosen per LKM.
- Role security.

Setelah spec dibuat, jangan implementasi dulu. Tunggu persetujuan saya.
```

## Prompt 3 - Struktur Data

```text
Saya setuju dengan spec-nya. Mulai implementasi tahap 1 saja: audit teknis dan persiapan struktur data.

Target:
1. Pastikan model/schema mendukung questionNumber, questionImage, imageAlt untuk soal.
2. Pastikan LKM mendukung sections dan estimatedMinutes jika diperlukan.
3. Pastikan LKM tidak lagi memakai skor pada alur UI/logic.
4. Tambahkan model/struktur feedback dosen per LKM jika diperlukan.
5. Pastikan modul remedial PDF dapat direferensikan.

Jangan ubah UI besar dulu.
Jangan ubah logic Pre Test/Post Test dulu kecuali wajib untuk struktur.

Jalankan lint/typecheck/test/build jika tersedia.
Laporkan file yang diubah, migration/model yang dibuat, dan hasil pengecekan.
```

## Prompt 4 - Amankan Pre Test

```text
Lanjut tahap 2: keamanan Pre Test.

Target:
1. Untuk role STUDENT, endpoint/API/loader Pre Test tidak boleh mengirim correctAnswer atau explanation.
2. Setelah mahasiswa submit Pre Test, jawaban tersimpan tetapi kunci dan pembahasan tidak tampil.
3. Dosen tetap bisa melihat kunci dan hasil.
4. Validasi backend harus memeriksa role, test_type, dan status submit.
5. Pastikan network response mahasiswa aman.

Jalankan lint/typecheck/test/build jika tersedia.
Laporkan file yang diubah dan cara memastikan tidak ada kebocoran kunci.
```

## Prompt 5 - KAM dan Modul Remedial

```text
Lanjut tahap 3: KAM dan modul remedial.

Target:
1. KAM tidak menampilkan kunci sebelum submit.
2. Setelah submit, KAM menampilkan review hasil.
3. KAM nomor 1 memakai cm².
4. KAM nomor 9 memakai 180°.
5. Jika skor KAM < KAM_KKM atau KAM_PASSING_SCORE, tampilkan modul remedial PDF.
6. Tombol Buka Modul dan Unduh Modul berfungsi.

Jangan ubah Pre Test kecuali ada shared component wajib.
Jalankan lint/typecheck/test/build jika tersedia.
```

## Prompt 6 - Post Test dan Pembahasan

```text
Lanjut tahap 4: Post Test dan pembahasan.

Target:
1. Post Test tidak menampilkan kunci/pembahasan sebelum submit.
2. Setelah submit, tampilkan soal, opsi, gambar, jawaban mahasiswa, jawaban benar, status benar/salah, dan pembahasan.
3. Gunakan pembahasan dari docs/source/Jawban dan Pembahasan untuk di tunjukan saat Post test.docx.
4. Terapkan revisi nomor 1-10 sesuai docs/data/prepost-question-bank.md dan docs/data/posttest-explanations.md.
5. Jangan ubah aturan Pre Test.

Jalankan lint/typecheck/test/build jika tersedia.
```

## Prompt 7 - Gambar Soal

```text
Lanjut tahap 5: support gambar soal Pre/Post Test.

Target:
1. Nomor 2, 3, 4, 6, 10 mendukung gambar.
2. Gunakan asset di public/assets/questions/prepost/.
3. Jangan ada broken image.
4. Gambar responsive dan punya alt text.
5. Ikuti docs/questions/image-mapping.md.

Jangan ubah kunci jawaban atau pembahasan pada tahap ini.
Jalankan lint/typecheck/test/build jika tersedia.
```

## Prompt 8 - Format Matematika

```text
Lanjut tahap 6: normalisasi format matematika.

Target:
- cm2 -> cm²
- m2 -> m²
- m3 -> m³
- dm3 -> dm³
- satuan2 -> satuan²
- 90o/90O -> 90°
- 180o/180O -> 180°
- 7, 38 -> 7,38
- gunakan × dan ∠ jika relevan.

Buat helper jika sesuai arsitektur project. Terapkan di soal, opsi, review, pembahasan, dan LKM jika relevan.
Jangan mengubah makna matematika.
Jalankan lint/typecheck/test/build jika tersedia.
```

## Prompt 9 - LKM 1-6

```text
Lanjut tahap 7: LKM 1 sampai LKM 6.

Target:
1. Masukkan struktur LKM 1-6 dari docs/source dan docs/data/lkm-1-6-map.md.
2. LKM adalah aktivitas belajar, bukan tes.
3. Tidak ada skor.
4. Tidak ada benar/salah.
5. Struktur mendukung Concrete, Pictorial, Abstract, jawaban mahasiswa, dan refleksi/pengalaman belajar.
6. Mahasiswa bisa mengisi dan submit.

Jalankan lint/typecheck/test/build jika tersedia.
```

## Prompt 10 - Feedback Dosen

```text
Lanjut tahap 8: feedback dosen per LKM.

Target:
1. Buat/perbaiki halaman Feedback LKM Mahasiswa untuk dosen.
2. Dosen bisa memilih mahasiswa dan melihat LKM 1-6.
3. Dosen bisa membaca jawaban/refleksi mahasiswa.
4. Dosen bisa memberi dan mengedit feedback.
5. Mahasiswa bisa melihat feedback dosen.
6. Feedback tersimpan terpisah dari jawaban mahasiswa.
7. Validasi role: hanya dosen yang bisa memberi feedback.

Jalankan lint/typecheck/test/build jika tersedia.
```

## Prompt 11 - Final QA

```text
Lakukan final QA untuk seluruh revisi sistem LKM Matematika.

Gunakan checklist di docs/testing/manual-test-lkm-mtk.md.
Jalankan lint, typecheck, test, dan build sesuai command yang tersedia.
Jika ada error, perbaiki hanya error yang terkait revisi ini.

Buat laporan final:
- file yang diubah,
- fitur yang selesai,
- fitur yang masih perlu data tambahan,
- cara mengganti placeholder gambar dengan gambar final,
- hasil testing,
- catatan risiko.
```

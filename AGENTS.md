# Project Rules: Sistem LKM Matematika PGSD

Project ini adalah sistem pembelajaran LKM Matematika untuk mahasiswa PGSD. Revisi ini berfokus pada materi geometri, pengukuran, LKM 1 sampai LKM 6, modul remedial, dan keamanan kunci jawaban.

## Fokus revisi

1. Mengganti data dummy dengan soal asli KAM, Pre Test, dan Post Test.
2. Memperbaiki gambar soal Pre/Post Test.
3. Memperbaiki kunci jawaban dan pembahasan.
4. Mengubah LKM menjadi aktivitas belajar tanpa skor.
5. Menambahkan LKM 1 sampai LKM 6.
6. Menambahkan feedback dosen per LKM.
7. Menambahkan modul remedial untuk mahasiswa yang tidak lulus KAM.
8. Mengamankan Pre Test agar tidak membocorkan kunci jawaban.
9. Merapikan format matematika seperti cm², m³, satuan², dan derajat.

## Role

Role yang ada di project:
- STUDENT / mahasiswa
- TEACHER / dosen

Mahasiswa dapat:
- mengerjakan KAM,
- mengerjakan Pre Test,
- mengerjakan Post Test,
- mengisi LKM 1 sampai LKM 6,
- melihat feedback dosen,
- membuka modul remedial jika tidak lulus KAM.

Dosen dapat:
- melihat hasil mahasiswa,
- melihat kunci jawaban,
- melihat pembahasan,
- melihat jawaban LKM mahasiswa,
- memberi dan mengedit feedback LKM mahasiswa.

## KAM

KAM adalah Tes Kemampuan Awal Matematis.

KAM tidak boleh menampilkan kunci sebelum mahasiswa submit.

Setelah submit, KAM boleh menampilkan review:
- soal,
- opsi,
- jawaban mahasiswa,
- jawaban benar,
- status benar/salah,
- skor,
- pembahasan jika tersedia.

Jika mahasiswa tidak lulus KAM, tampilkan modul remedial:
`/modules/PGSD-MODUL-2-Matematika-gabungan.pdf`

Gunakan KKM 70 jika belum ada konfigurasi lain.

Revisi khusus KAM:
- KAM nomor 1 harus memakai cm², bukan cm2.
- KAM nomor 9 harus menampilkan 180°, bukan 180o.

## Pre Test

Pre Test adalah asesmen awal. Pre Test tidak boleh membocorkan kunci jawaban kepada mahasiswa.

Untuk mahasiswa:
- jangan tampilkan correctAnswer,
- jangan tampilkan explanation,
- jangan kirim correctAnswer ke frontend,
- jangan kirim explanation ke frontend,
- jangan tampilkan review detail berisi kunci,
- setelah submit cukup tampilkan status tersimpan atau skor jika sistem memakai skor.

Untuk dosen:
- boleh melihat kunci dan pembahasan.

Keamanan wajib dilakukan di backend, bukan hanya menyembunyikan field di frontend.

## Post Test

Post Test adalah asesmen akhir.

Sebelum submit:
- jangan tampilkan kunci,
- jangan tampilkan pembahasan.

Setelah submit, Post Test boleh menampilkan review:
- soal,
- gambar,
- opsi,
- jawaban mahasiswa,
- jawaban benar,
- status benar/salah,
- pembahasan.

Pembahasan hanya muncul setelah submit.

## LKM

LKM bukan tes.
LKM tidak memakai skor.
LKM tidak memakai benar/salah.
LKM tidak memakai status GRADED di UI/alur pengguna.

LKM adalah aktivitas belajar, refleksi, dan pengalaman belajar mahasiswa.

LKM harus tersedia dari LKM 1 sampai LKM 6.

Setiap LKM harus mendukung:
- Concrete,
- Pictorial,
- Abstract,
- jawaban mahasiswa,
- pengalaman belajar/refleksi mahasiswa,
- feedback dosen.

LKM 1: Segitiga, Segiempat, dan Lingkaran; sifat/ciri bidang datar.
LKM 2: Keliling bidang datar segiempat, segitiga, dan lingkaran.
LKM 3: Luas bidang datar segiempat, segitiga, dan lingkaran.
LKM 4: Simetri, Pengubinan, Sistem Koordinat, dan Pencerminan.
LKM 5: Bangun-bangun ruang sederhana.
LKM 6: Volume bangun-bangun ruang sederhana.

## Feedback dosen

Feedback dosen harus terpisah dari jawaban mahasiswa.

Dosen dapat:
- memilih mahasiswa,
- melihat LKM 1 sampai LKM 6,
- membaca jawaban mahasiswa,
- memberi feedback,
- mengedit feedback.

Mahasiswa dapat:
- melihat feedback dosen setelah disimpan.

Halaman yang disarankan: `Feedback LKM Mahasiswa`.

## Modul remedial

Gunakan file PDF:
`public/modules/PGSD-MODUL-2-Matematika-gabungan.pdf`

Modul digunakan untuk mahasiswa yang tidak lulus KAM.
Modul bukan tes.
Modul hanya bahan belajar/remedial.

Jika skor KAM < KAM_PASSING_SCORE atau KAM_KKM, tampilkan rekomendasi:
`Anda disarankan mempelajari Modul 2 Pendalaman Materi Matematika, khususnya bagian Geometri dan Pengukuran, sebelum melanjutkan pembelajaran.`

Sediakan tombol:
- Buka Modul,
- Unduh Modul,
- Lanjut Belajar Setelah Membaca Modul.

## Gambar soal

Pre/Post Test nomor berikut wajib mendukung gambar:
- nomor 2,
- nomor 3,
- nomor 4,
- nomor 6,
- nomor 10.

Gunakan asset:
- `/assets/questions/prepost/prepost_q2.png`
- `/assets/questions/prepost/prepost_q3.png`
- `/assets/questions/prepost/prepost_q4.png`
- `/assets/questions/prepost/prepost_q6.png`
- `/assets/questions/prepost/prepost_q10.png`

Jangan biarkan broken image. Jika gambar final belum tersedia, tampilkan placeholder yang rapi.

## Format matematika

Normalisasi:
- cm2 menjadi cm²
- m2 menjadi m²
- m3 menjadi m³
- dm3 menjadi dm³
- satuan2 menjadi satuan²
- 90o atau 90O menjadi 90°
- 180o atau 180O menjadi 180°
- 7, 38 menjadi 7,38
- gunakan × untuk perkalian
- gunakan ∠ untuk sudut jika relevan
- gunakan ½ atau MathJax/KaTeX jika sistem mendukung.

## Larangan penting

- Jangan mengubah semua file sekaligus.
- Jangan menambahkan skor pada LKM.
- Jangan membocorkan kunci Pre Test.
- Jangan menghapus soal bergambar.
- Jangan memakai data dummy lama sebagai data final.
- Jangan mengirim `.env`, `node_modules`, atau `.next` sebagai bagian final project.

## Cara kerja

Untuk setiap fitur:
1. Audit file terkait.
2. Buat rencana perubahan.
3. Implementasi kecil.
4. Jalankan lint/typecheck/test/build jika tersedia.
5. Laporkan file yang diubah dan alasannya.

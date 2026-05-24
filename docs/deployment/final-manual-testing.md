# Final Manual Testing Checklist — 300 Mahasiswa

## Sebelum Buka Akses ke Mahasiswa

### Login & Role
- [ ] Login mahasiswa berhasil
- [ ] Login dosen berhasil
- [ ] Mahasiswa tidak bisa akses /guru/*
- [ ] Dosen tidak bisa akses /mahasiswa/*
- [ ] Logout berfungsi

### KAM
- [ ] Soal asli muncul (bukan dummy)
- [ ] Soal nomor 1: cm² (bukan cm2)
- [ ] Soal nomor 9: 180° (bukan 180o)
- [ ] Sebelum submit: TIDAK ada kunci jawaban di response
- [ ] Setelah submit: review muncul (soal + jawaban + kunci + status)
- [ ] Skor < 70: modul remedial PDF muncul
- [ ] Tombol Buka Modul dan Unduh Modul berfungsi

### Pre Test
- [ ] Soal asli muncul
- [ ] Gambar nomor 2, 3, 4, 6, 7, 8, 9, 10 muncul
- [ ] Setelah submit: hanya konfirmasi tersimpan
- [ ] Network response TIDAK mengandung correctAnswer
- [ ] Network response TIDAK mengandung explanation

### Post Test
- [ ] Soal asli muncul
- [ ] Gambar muncul
- [ ] Sebelum submit: TIDAK ada kunci
- [ ] Setelah submit: review + pembahasan muncul
- [ ] Format matematika rapi (cm², m³, °)

### LKM 1-6
- [ ] Semua 6 LKM tersedia
- [ ] Tidak ada skor
- [ ] Tidak ada benar/salah
- [ ] Gambar LKM muncul (LKM 2, 3, 4, 5)
- [ ] Tabel input berfungsi
- [ ] Mahasiswa bisa simpan draft
- [ ] Mahasiswa bisa submit
- [ ] Refleksi wajib setelah submit (min 20 karakter)
- [ ] Rating 1-5 berfungsi
- [ ] LKM berikutnya terbuka setelah refleksi

### Feedback Dosen
- [ ] Dosen bisa pilih mahasiswa
- [ ] Dosen bisa lihat jawaban LKM
- [ ] Dosen bisa tulis feedback
- [ ] Dosen bisa edit feedback
- [ ] Mahasiswa bisa lihat feedback di notifikasi
- [ ] Mahasiswa bisa lihat feedback di result LKM

### Modul Remedial
- [ ] PDF bisa dibuka
- [ ] PDF bisa diunduh
- [ ] Refleksi modul berfungsi

### Pesan Dosen
- [ ] Dosen bisa kirim pesan
- [ ] Mahasiswa bisa lihat pesan di notifikasi
- [ ] Badge "Baru" muncul

### Performa (300 mahasiswa)
- [ ] Dashboard dosen tidak lambat
- [ ] Daftar mahasiswa bisa di-scroll/search
- [ ] Chart/grafik muncul dengan benar
- [ ] Tidak ada error 500 saat banyak user

### Build
- [ ] `npm run build` berhasil tanpa error
- [ ] Tidak ada TypeScript error

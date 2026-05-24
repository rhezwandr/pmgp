# Pre/Post Test Question Bank - Revisi Utama

Sumber:
- `docs/source/PRE- POST TEST SOAL KEMAMPUAN GEOMETRI.docx`
- `docs/source/Jawban dan Pembahasan untuk di tunjukan saat Post test.docx`

File sumber tetap menjadi rujukan utama. File ini adalah ringkasan revisi yang wajib diperhatikan.

## Gambar wajib

Pre/Post Test nomor berikut membutuhkan gambar:

| No | Asset |
|---|---|
| 2 | `/assets/questions/prepost/prepost_q2.png` |
| 3 | `/assets/questions/prepost/prepost_q3.png` |
| 4 | `/assets/questions/prepost/prepost_q4.png` |
| 6 | `/assets/questions/prepost/prepost_q6.png` |
| 10 | `/assets/questions/prepost/prepost_q10.png` |

## Revisi detail

### Nomor 1

- Pertanyaan harus menggunakan “Berapa m³”.
- Jawaban benar: 7,38 m³.
- Pembahasan harus konsisten:
  - panjang taman 210 dm = 21 m,
  - lebar taman 14 m,
  - lebar jalan setapak 300 cm = 3 m,
  - ketebalan aspal 3 cm = 0,03 m,
  - luas jalan setapak = luas persegi panjang besar - luas persegi panjang kecil,
  - volume aspal = luas jalan setapak × ketebalan,
  - hasil akhir 7,38 m³.
- Jangan keliru antara lebar jalan setapak 300 cm dan ketebalan 3 cm.

### Nomor 2

- Soal membutuhkan gambar.
- Luas harus memakai m², bukan m³.
- Gunakan rumus: L = ½ × alas × tinggi.
- Periksa soal, opsi, jawaban benar, dan pembahasan dari sumber.

### Nomor 3

- Soal membutuhkan gambar.
- Satuan luas harus m².
- Jika ada bentuk akar, tampilkan rapi, misalnya 2√2 m.
- Periksa jawaban dan pembahasan dari sumber.

### Nomor 4

- Soal membutuhkan gambar/sketsa bak kamar mandi.
- Gunakan satuan dm, dm³, m³, dan menit secara konsisten.
- Jika volume = 6000 dm³ = 6 m³ dan debit dua selang = 4 m³/menit, maka waktu = 6/4 = 1,5 menit.

### Nomor 5

- Satuan volume harus m³.
- Pembahasan aljabar harus rapi:
  - p = l + 3
  - l = t - 2
  - luas alas = p × l = 4
  - hasil akhir volume = 12 m³ jika sesuai pembahasan final.
- Perbaiki typo “Jawban” menjadi “Jawaban”.

### Nomor 6

- Soal membutuhkan gambar.
- Satuan luas harus satuan².
- Jika luas daerah diarsir = 5 × 5 = 25 satuan², pastikan opsi dan kunci sesuai.
- Jangan gunakan satuan2.

### Nomor 7

- Soal rotasi harus memakai 90°, bukan 90O.
- Jika ada gambar awal dan opsi gambar hasil rotasi, pastikan asset/mapping tidak broken.
- Pembahasan hanya muncul setelah Post Test submit.

### Nomor 8

- Gunakan format sudut: 70°, 3x + 30°, x + 40°, 95°.
- Gunakan simbol ∠ jika memungkinkan, misalnya ∠DEF.
- Jawaban akhir 95° jika sesuai pembahasan final.

### Nomor 9

- Cek konsistensi soal, opsi, jawaban, dan kunci.
- Jika soal denah membutuhkan gambar dan gambar belum muncul, buat placeholder dan mapping asset.

### Nomor 10

- Soal membutuhkan gambar.
- Satuan luas harus cm².
- Jika hasil akhir 38,5 cm², tampilkan 38,5 cm².
- Jika opsi sumber duplikat, beri catatan data/admin untuk dikonfirmasi, tetapi jangan merusak sistem.

## Aturan Pre Test vs Post Test

Pre Test:
- mahasiswa tidak boleh melihat jawaban benar,
- mahasiswa tidak boleh melihat pembahasan,
- backend tidak boleh mengirim `correctAnswer` atau `explanation` ke mahasiswa.

Post Test:
- setelah submit, mahasiswa boleh melihat jawaban benar dan pembahasan.

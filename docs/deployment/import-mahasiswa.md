# Import 300 Mahasiswa

## Persiapan

1. Siapkan file CSV dengan format:
```
name,email,nim,password,classCode
Anisa Rahma,anisa@university.ac.id,2024001,PasswordAman1,KLS-GEO-2026
Bima Pratama,bima@university.ac.id,2024002,PasswordAman2,KLS-GEO-2026
```

2. Pastikan kelas sudah dibuat di sistem (classCode harus cocok)
3. Pastikan database sudah di-backup

## Menjalankan Import

```bash
npm run import:students -- path/to/mahasiswa.csv
```

Atau:
```bash
npx tsx scripts/import-students.ts path/to/mahasiswa.csv
```

## Hasil Import

Script akan menampilkan:
- Total baris CSV
- Berhasil diimport
- Duplikat email (di-skip)
- Duplikat NIM (di-skip)
- Kelas tidak ditemukan (gagal)
- Error lain

## Aturan

- Password di-hash dengan bcrypt (12 rounds)
- Email duplikat: di-skip, tidak overwrite
- NIM duplikat: di-skip, tidak overwrite
- Kelas tidak ada: dilaporkan, mahasiswa tidak dibuat
- Tidak ada limit jumlah — aman untuk 300+ mahasiswa
- Tidak menghapus akun lama
- Proses batch 50 per batch untuk efisiensi

## Template CSV

Tersedia di: `docs/templates/import-mahasiswa-template.csv`

## Catatan Keamanan

- JANGAN commit file CSV berisi data mahasiswa asli ke git
- JANGAN gunakan password yang sama untuk semua mahasiswa
- Setelah import, minta mahasiswa ganti password (jika fitur tersedia)
- Simpan CSV di tempat aman, hapus setelah import berhasil

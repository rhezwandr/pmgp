# Production Seed — Kurikulum Only

## Perbedaan Development vs Production

| | Development | Production |
|---|---|---|
| Akun demo | ✅ guru@example.com, mahasiswa1/2 | ❌ Tidak boleh |
| Kurikulum (soal, LKM, modul) | ✅ | ✅ |
| cleanDatabase() | ✅ | ❌ JANGAN |
| Password "password123" | ✅ | ❌ JANGAN |

## Langkah Production

```bash
# 1. Jalankan migration
npx prisma migrate deploy

# 2. Seed kurikulum saja (soal + LKM + modul)
npx prisma db seed

# 3. Hapus akun demo (jika seed membuat akun demo)
# Atau: buat script seed terpisah untuk production

# 4. Buat akun dosen asli secara manual atau via script
# 5. Import 300 mahasiswa via CSV
npm run import:students -- data/mahasiswa.csv
```

## Catatan

- `prisma db seed` saat ini membuat akun demo. Untuk production:
  - Jalankan seed → hapus akun demo dari database, ATAU
  - Modifikasi seed.ts untuk skip akun demo jika NODE_ENV=production
- JANGAN jalankan `prisma migrate reset` di production (menghapus semua data)
- JANGAN jalankan `cleanDatabase()` di production

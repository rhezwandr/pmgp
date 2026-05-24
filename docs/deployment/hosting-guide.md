# Hosting Guide — 300 Mahasiswa

## Rekomendasi Stack

| Komponen | Rekomendasi | Catatan |
|---|---|---|
| **Next.js** | Vercel (Pro) atau Railway | Vercel free tier cukup untuk uji coba |
| **PostgreSQL** | Supabase Pro / Neon / Railway | Free tier untuk uji coba, berbayar untuk 300 user serentak |
| **JANGAN** | SQLite, shared hosting PHP | Tidak mendukung concurrent writes |

## Catatan Connection Pooling

Jika deploy di Vercel (serverless), gunakan connection pooling:
- Supabase: gunakan `?pgbouncer=true` di DATABASE_URL
- Neon: sudah built-in pooling
- Railway: tambahkan PgBouncer jika perlu

## Langkah Deploy

```bash
# 1. Build
npm run build

# 2. Set environment variables di hosting dashboard

# 3. Jalankan migration
npx prisma migrate deploy

# 4. Seed kurikulum (TANPA akun demo)
# Gunakan script production seed atau manual

# 5. Import 300 mahasiswa
npm run import:students -- data/mahasiswa.csv

# 6. Verifikasi
# - Login dosen
# - Login mahasiswa
# - Cek Pre Test tidak bocor kunci
# - Cek LKM dan gambar
```

## Estimasi Resource untuk 300 Mahasiswa

| Metrik | Estimasi |
|---|---|
| Database size | ~50-100 MB (termasuk jawaban LKM) |
| Concurrent connections | 30-50 (peak saat KAM/Pre Test) |
| Storage (gambar) | ~20 MB (sudah di public/) |
| RAM server | 512 MB minimum |

## Rollback Plan

1. Backup database sebelum setiap tahap
2. Jika error: restore dari backup terakhir
3. Jangan `prisma migrate reset` di production

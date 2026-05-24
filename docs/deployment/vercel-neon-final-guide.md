# Deploy Production — Vercel + Neon

Target: 300 mahasiswa, PostgreSQL managed, serverless

---

## A. Setup Neon Database

1. Buat project di [Neon](https://neon.tech) (gunakan paid/Pro untuk 300 user serentak)
2. Buat database baru
3. Ambil connection strings:
   - **Pooled** (untuk runtime): `postgresql://user:pass@ep-xxx-pooler.region.neon.tech/dbname?sslmode=require`
   - **Direct** (untuk migration): `postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require`

## B. Setup Vercel

1. Import project dari GitHub
2. Set environment variables di Vercel dashboard:

```
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.neon.tech/dbname?sslmode=require
DIRECT_DATABASE_URL=postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require
AUTH_SECRET=<hasil generate di bawah>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

3. Build command: `npm run build` (sudah default)
4. Deploy

## C. Generate AUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya ke Vercel environment variables.

## D. Migration Production

Dari terminal lokal dengan env production:

```bash
# Set env sementara untuk migration
export DATABASE_URL="pooled-url"
export DIRECT_DATABASE_URL="direct-url"

npx prisma migrate deploy
```

Atau jalankan di Vercel build step (otomatis jika ada `postinstall` script).

## E. Seed Kurikulum

```bash
npx prisma db seed
```

Ini membuat: 30 soal (KAM/Pre/Post), 6 LKM, 1 modul remedial, + akun demo.

## F. Hapus Akun Demo

```bash
npm run delete:demo
```

Menghapus: guru@example.com, mahasiswa1@example.com, mahasiswa2@example.com

## G. Buat Akun Dosen Asli

Daftarkan dosen asli melalui halaman `/register` atau buat manual via script.

## H. Import 300 Mahasiswa Asli

```bash
npm run import:students -- data/mahasiswa-asli.csv
```

⚠️ File `data/mahasiswa-asli.csv` JANGAN di-commit ke git.

## I. Backup

```bash
pg_dump "DIRECT_DATABASE_URL" -F c -f backup_setelah_import.dump
```

## J. Final Manual Test

- [ ] Login dosen
- [ ] Login mahasiswa
- [ ] KAM berjalan
- [ ] Pre Test tidak bocor kunci (cek Network tab)
- [ ] LKM 1-6 tampil dengan gambar
- [ ] Feedback dosen bisa disimpan
- [ ] Export class report download Excel
- [ ] Post Test pembahasan muncul setelah submit
- [ ] Modul PDF bisa dibuka

---

## Catatan Penting

- **JANGAN** gunakan free tier Neon untuk hari pelaksanaan (cold start 5-10 detik)
- **JANGAN** jalankan `prisma migrate reset` di production
- **JANGAN** jalankan `npm run simulate:test-progress` di production
- **JANGAN** commit file CSV mahasiswa asli
- **JANGAN** load test ke production tanpa konfirmasi
- Backup database sebelum dan sesudah setiap tahap ujian

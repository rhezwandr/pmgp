# Verifikasi Database Production

## Urutan Setup Database Production

```bash
# 1. Set env production (di terminal atau .env lokal sementara)
# DATABASE_URL = pooled connection dari Neon/Supabase
# DIRECT_DATABASE_URL = direct connection dari Neon/Supabase
# AUTH_SECRET = hasil: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 2. Validasi schema
npx prisma validate

# 3. Generate client
npx prisma generate

# 4. Jalankan migration
npx prisma migrate deploy

# 5. Seed kurikulum (soal + LKM + modul)
npx prisma db seed

# 6. Hapus akun demo
npm run delete:demo

# 7. Import mahasiswa asli
npm run import:students -- data/mahasiswa-asli.csv

# 8. Health check
npm run check:production-db
```

## Checklist Sebelum Link Dibagikan

- [ ] `npm run check:production-db` menampilkan "DATABASE SIAP PRODUCTION"
- [ ] DATABASE_URL bukan localhost
- [ ] AUTH_SECRET minimal 32 karakter dan bukan default
- [ ] Akun demo: 0
- [ ] Akun dummy @example.test: 0
- [ ] Tests: 3 (KAM, PRE_TEST, POST_TEST)
- [ ] Questions: 30
- [ ] LKM: 6
- [ ] Modules: 1
- [ ] Mahasiswa asli sudah diimport
- [ ] Backup database sudah dibuat
- [ ] Login dosen berhasil
- [ ] Login mahasiswa berhasil
- [ ] Pre Test tidak bocor kunci (cek Network tab)

## Cara Backup

```bash
pg_dump "DIRECT_DATABASE_URL_ANDA" -F c -f backup_production_$(date +%Y%m%d).dump
```

## Jika Ada Masalah

- Akun demo masih ada: `npm run delete:demo`
- Akun dummy masih ada: `npm run cleanup:test-students`
- Kurikulum belum ada: `npx prisma db seed`
- Migration belum jalan: `npx prisma migrate deploy`

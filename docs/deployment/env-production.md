# Environment Variables — Production

Target: 300 mahasiswa, serverless deployment, PostgreSQL managed

## Variabel Wajib

| Variable | Rahasia? | Contoh | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | ✅ Ya | `postgresql://user:pass@pooler.host:5432/db?sslmode=require` | Pooled connection (runtime) |
| `DIRECT_DATABASE_URL` | ✅ Ya | `postgresql://user:pass@direct.host:5432/db?sslmode=require` | Direct connection (migration) |
| `AUTH_SECRET` | ✅ Ya | `openssl rand -base64 32` | Minimal 32 karakter random |
| `NEXT_PUBLIC_APP_URL` | ❌ Tidak | `https://lkm-geometri.vercel.app` | URL publik aplikasi |
| `NODE_ENV` | ❌ Tidak | `production` | Wajib `production` saat deploy |

## Connection Pooling (WAJIB untuk 300 mahasiswa di serverless)

### Neon
```
DATABASE_URL="postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require"
DIRECT_DATABASE_URL="postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require"
```
Neon sudah built-in connection pooling.

### Supabase
```
DATABASE_URL="postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"
```
Gunakan port 6543 (pooler) untuk runtime, port 5432 (direct) untuk migration.

## Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

## Contoh .env Production (JANGAN commit ke git)

```
DATABASE_URL="postgresql://postgres:xxxxx@db.supabase.co:5432/postgres"
AUTH_SECRET="hasil-openssl-rand-base64-32-karakter"
NEXT_PUBLIC_APP_URL="https://domain-anda.vercel.app"
NODE_ENV="production"
```

## Catatan Keamanan

- JANGAN gunakan `password123` di production
- JANGAN gunakan `development-secret-change-me` sebagai AUTH_SECRET
- Sistem akan CRASH di production jika AUTH_SECRET tidak di-set (by design)
- DATABASE_URL harus PostgreSQL, BUKAN SQLite

# Vercel Environment Variables — Checklist

## Env yang WAJIB ada di Vercel Production

| Variable | Contoh Format | Catatan |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx-pooler.region.neon.tech/db?sslmode=require` | **Harus pooled** (ada `-pooler` di hostname) |
| `DIRECT_DATABASE_URL` | `postgresql://user:pass@ep-xxx.region.neon.tech/db?sslmode=require` | **Harus direct** (tanpa `-pooler`) |
| `AUTH_SECRET` | `<random 32+ chars>` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXT_PUBLIC_APP_URL` | `https://pmgp.vercel.app` | Domain production |
| `NODE_ENV` | `production` | Vercel biasanya set otomatis |

## Opsional (jika masih dipakai oleh kode lama)

| Variable | Catatan |
|---|---|
| `NEXTAUTH_SECRET` | Sama dengan AUTH_SECRET jika kode masih membaca ini |
| `NEXTAUTH_URL` | Sama dengan NEXT_PUBLIC_APP_URL |

## Cara Cek di Vercel

1. Buka: https://vercel.com → Project `pmgp` → Settings → Environment Variables
2. Pastikan semua variable di atas ada untuk scope **Production**
3. Pastikan tidak ada typo (DATABASE-URL, DIRECT_URL, dll)
4. Pastikan DATABASE_URL mengandung `-pooler` (Neon pooled)
5. Pastikan DIRECT_DATABASE_URL TIDAK mengandung `-pooler`

## Setelah Mengubah Env

**WAJIB Redeploy** setelah menambah/mengubah env:
- Vercel → Deployments → klik "..." pada deployment terakhir → Redeploy

## Troubleshooting

| Pesan Error | Penyebab | Solusi |
|---|---|---|
| "Konfigurasi database belum tersedia" | DATABASE_URL tidak di-set | Tambahkan di Vercel env |
| "Koneksi database sedang bermasalah" | Neon cold start / network | Tunggu 5-10 detik, coba lagi |
| "Database belum selesai disiapkan" | Migration belum jalan | Jalankan `npx prisma migrate deploy` |
| "Email atau password salah" | Akun tidak ada / password salah | Normal — bukan error sistem |

## JANGAN

- Jangan tulis DATABASE_URL/DIRECT_DATABASE_URL asli di file mana pun
- Jangan commit .env ke git
- Jangan pakai localhost di Vercel production
- Jangan pakai AUTH_SECRET yang pendek atau default

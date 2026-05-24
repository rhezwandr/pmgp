# Staging Load Test — 300 Mahasiswa

## Tujuan

Memastikan sistem aman digunakan 300 mahasiswa serentak tanpa error 500, timeout, atau data tercampur.

## Workflow Lengkap

### 1. Generate 300 Akun Dummy

```bash
npm run generate:test-students
```

Output: `data/test-students-300.csv` (300 baris, email @example.test)

### 2. Setup Kelas Staging

```bash
npx tsx scripts/setup-staging-classes.ts
```

Membuat KELAS-A sampai KELAS-F + akun dosen staging.

### 3. Import Akun Dummy

```bash
npm run import:students -- data/test-students-300.csv
```

### 4. Smoke Test (10 user)

```bash
STAGING_BASE_URL=http://localhost:3000 k6 run --vus 10 --duration 30s scripts/load-test/staging-300.js
```

### 5. Moderate Test (50 user)

```bash
STAGING_BASE_URL=http://localhost:3000 k6 run --vus 50 --duration 60s scripts/load-test/staging-300.js
```

### 6. Heavy Test (100 concurrent)

```bash
STAGING_BASE_URL=http://localhost:3000 k6 run scripts/load-test/staging-300.js
```

Ini menjalankan skenario lengkap: smoke → moderate → heavy.

### 7. Batch Test 300 User

Jalankan heavy test dengan target 300 VU:
```bash
STAGING_BASE_URL=http://localhost:3000 k6 run --vus 300 --duration 120s scripts/load-test/staging-300.js
```

## Kriteria Lulus

| Metrik | Target |
|---|---|
| Error rate | < 1% |
| p95 response time | < 5 detik |
| HTTP 500 | 0 |
| Database timeout | 0 |
| Data tercampur | 0 |
| Pre Test kunci bocor | 0 |

## Cara Membaca Hasil k6

```
✓ login status 200
✓ pretest no correctAnswer
✓ pretest no explanation

http_req_duration...: avg=234ms  p(95)=1.2s
http_req_failed.....: 0.00%
```

- `http_req_failed` harus 0% atau sangat kecil
- `p(95)` harus di bawah 5 detik
- Semua check harus ✓

## Cleanup Setelah Testing

```bash
npm run cleanup:test-students
```

Menghapus semua akun @example.test + kelas staging.

## Keamanan

- Load test DITOLAK otomatis jika URL mengandung "production" atau "vercel.app"
- Override: set `ALLOW_PRODUCTION_LOAD_TEST=true` (HANYA jika yakin)
- Data dummy: email @example.test, NIM TEST0001-TEST0300
- Cleanup hanya hapus @example.test, tidak menyentuh akun asli
- Guard: cleanup ditolak di NODE_ENV=production tanpa ALLOW_TEST_DATA_CLEANUP=true

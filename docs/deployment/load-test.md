# Load Test — Target 300 Mahasiswa

## Skenario

| Skenario | Concurrent Users | Durasi |
|---|---|---|
| Login serentak | 100 | 30 detik |
| Buka dashboard | 100 | 30 detik |
| Submit KAM | 100 | 60 detik |
| Submit Pre Test | 100 | 60 detik |
| Buka LKM + submit | 100 | 120 detik |
| Dashboard dosen | 5 | 30 detik |

## Target

- Tidak ada error 500
- Tidak ada timeout database (> 30 detik)
- Submit tidak double (idempotent)
- Data tidak tercampur antar mahasiswa
- Response time < 3 detik untuk halaman biasa
- Response time < 5 detik untuk submit tes

## Tools Rekomendasi

- **k6** (gratis, scriptable): https://k6.io
- **Artillery** (Node.js based): https://artillery.io
- **Apache Bench** (sederhana): `ab -n 300 -c 50 URL`

## Contoh Script k6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '60s', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://your-app.vercel.app/api/student/access');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
```

## Catatan

- Jangan load test ke production tanpa izin hosting provider
- Gunakan staging environment untuk load test
- Monitor database connections selama test
- Untuk 300 mahasiswa, peak concurrent biasanya 30-50 (tidak semua online bersamaan)
- Skenario terburuk: 300 mahasiswa submit KAM dalam 30 menit = ~10 submit/menit (sangat ringan)

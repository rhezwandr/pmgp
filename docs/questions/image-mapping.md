# Mapping Gambar Soal Pre/Post Test

Folder asset:

`public/assets/questions/prepost/`

## Status Gambar

Semua gambar telah diganti dengan gambar soal asli (bukan placeholder).

## Mapping Detail

| Nomor Soal | Nama File | Deskripsi Konten |
|---|---|---|
| 2 | prepost_q2.png | Daerah yang diarsir (segitiga dalam grid 3×3) — soal luas daerah diarsir |
| 3 | prepost_q3.png | Papan kayu berkelok-kelok di dalam kubus — soal luas permukaan papan dalam ruang 3D |
| 4 | prepost_q4.png | Segitiga siku-siku dengan sisi 3 cm, 4 cm, dan 13 cm — soal luas/keliling segitiga |
| 6 | prepost_q6.png | Dua persegi tumpang tindih dengan area arsiran di irisan — soal luas irisan/gabungan |
| 10 | prepost_q10.png | Balok dengan dimensi 30 dm × 2 dm × 100 dm — soal volume bangun ruang |

## Aturan

- Jangan ubah nama file (prepost_q2.png, prepost_q3.png, dst.)
- Gambar asli sudah tersedia — bukan placeholder
- Gunakan `<img>` dengan alt text yang deskriptif
- Fallback: jika gambar gagal load, tampilkan pesan "Gambar soal tidak dapat ditampilkan"

## Referensi Kode

```tsx
// Contoh penggunaan di komponen
{question.imageUrl && (
  <img
    src={question.imageUrl}
    alt={`Gambar soal nomor ${question.number}`}
    className="max-w-full rounded-md border my-3"
    onError={(e) => {
      e.currentTarget.style.display = 'none';
    }}
  />
)}
```

## Path di Database / Constants

Jika soal disimpan di database, gunakan path relatif:
- `/assets/questions/prepost/prepost_q2.png`
- `/assets/questions/prepost/prepost_q3.png`
- `/assets/questions/prepost/prepost_q4.png`
- `/assets/questions/prepost/prepost_q6.png`
- `/assets/questions/prepost/prepost_q10.png`

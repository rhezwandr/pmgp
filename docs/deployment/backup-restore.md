# Backup & Restore — 300 Mahasiswa

## Jadwal Backup Wajib

| Waktu | Alasan |
|---|---|
| Sebelum import 300 mahasiswa | Rollback jika import gagal |
| Setelah import mahasiswa | Baseline data mahasiswa |
| Sebelum KAM | Baseline sebelum tes pertama |
| Setelah KAM selesai | Data KAM 300 mahasiswa aman |
| Sebelum Pre Test | Checkpoint |
| Setelah Pre Test | Data Pre Test aman |
| Setelah semua LKM selesai | Data LKM 1-6 aman |
| Sebelum Post Test | Checkpoint terakhir |
| Setelah Post Test | Data final lengkap |

## Backup PostgreSQL

```bash
# Backup full database
pg_dump -h HOST -U USER -d DATABASE -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# Contoh Supabase
pg_dump "postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres" -F c -f backup.dump
```

## Restore

```bash
# Restore dari backup
pg_restore -h HOST -U USER -d DATABASE --clean --if-exists backup.dump

# Atau SQL plain
psql "DATABASE_URL" < backup.sql
```

## Managed Database (Supabase/Neon)

- Supabase: Dashboard → Database → Backups (otomatis harian)
- Neon: Branching (bisa buat snapshot kapan saja)
- Railway: Manual pg_dump

## Catatan untuk 300 Mahasiswa

- Backup setelah KAM bisa berukuran ~10-20 MB
- Backup setelah semua LKM bisa berukuran ~50-100 MB (jawaban teks panjang)
- Simpan backup di tempat terpisah (Google Drive / cloud storage)
- Label backup dengan jelas: `backup_setelah_kam_20260601.dump`

# Sistem Pembelajaran KAM-LKM

Role-based local learning management system for mathematics learning with strict staged access for mahasiswa and grouped analytics for guru-dosen.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Custom cookie auth with bcrypt password hashing
- Zod and React Hook Form
- Recharts
- xlsx export
- jsPDF report generation

## Quick Start Local Development

```bash
npm install
npm run setup
npm run dev
```

Open `http://localhost:3000`.

`npm run setup` will:

- create `.env` from `.env.example` if `.env` does not exist
- start PostgreSQL with Docker Compose
- run Prisma migrations
- seed minimal academic data

## Manual Setup Alternative

```bash
cp .env.example .env
docker compose up -d
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The default local database URL is:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kam_lkm_db?schema=public"
```

If the database is not ready, login/register returns a JSON error message instead of crashing the browser:

```json
{"error":"Konfigurasi database belum siap. Isi DATABASE_URL di .env, jalankan migrasi, lalu seed data."}
```

## Minimal Seed Data

- Demo dosen: `guru@example.com` / `password123`
- Kelas contoh: `Kelas Contoh KAM-LKM`
- Kode kelas contoh: `KLS-CONTOH`

Seed data lama yang berisi banyak mahasiswa dummy sudah dibersihkan. Untuk menguji alur baru, register mahasiswa manual dengan kode kelas `KLS-CONTOH`, atau login sebagai dosen lalu buat kelas baru dari halaman `Kelas Saya`.

## Register Role Flow

Register wajib memilih role:

- `Mahasiswa`: wajib mengisi NIM dan Kode Kelas. Sistem mencari `Class.code`, membuat profil mahasiswa, lalu membuat enrollment di `ClassMember`.
- `Dosen`: tidak perlu kode kelas. Sistem membuat profil dosen dan dosen dapat membuat kelas dengan kode unik dari dashboard.

Mahasiswa tidak memilih dosen secara manual. Relasinya selalu terbentuk melalui `Dosen -> Kelas -> Mahasiswa`.

## Student Flow

The student flow is enforced by `getStudentLearningAccess(studentId)`:

Login/Register -> Tes KAM -> Check Score.

If score is below KKM, Dashboard, Pre Test, LKM, and Post Test remain locked. The student must complete Modul Prasyarat before retaking Tes KAM.

If score reaches KKM, Dashboard and Pre Test unlock. LKM 1 opens after Pre Test. LKM 2 opens only after LKM 1 is submitted and learning feedback is submitted. LKM 3 opens only after LKM 2 feedback. Post Test opens only after LKM 3 feedback. Peer assessment is optional and never blocks progress.

## Lock / Unlock Logic

Central logic lives in `src/lib/learning-access.ts` and returns:

- KAM completion and pass state
- prerequisite module requirements
- retake eligibility
- dashboard, Pre Test, LKM, and Post Test access
- active stage
- locked stages and Indonesian lock messages
- progress percentage

The same function is used by sidebars, dashboard, route guards, API handlers, and page-level guards.

## Teacher Flow

Teacher dashboard shows summary only: class counts, student counts, KAM pass status, Pre/Post completion, average scores, class cards, and students needing attention. Full student lists are accessed through Kelas Saya or class dashboards.

Teachers can create classes from `Kelas Saya`. Each class receives a unique code such as `KLS-A1B2C3`; students use that code during registration.

Teacher pages include:

- Dashboard Guru
- Kelas Saya
- Dashboard Per Kelas
- Detail Mahasiswa
- Progress Mahasiswa
- Rekap Nilai
- Laporan Pembelajaran
- Pengaturan

## Useful Commands

```bash
npm run setup
npm run db:up
npm run db:down
npm run prisma:migrate
npm run prisma:seed
npm test
npm run build
```

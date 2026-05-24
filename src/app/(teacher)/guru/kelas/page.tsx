import { Search } from "lucide-react";

import { ClassCreateForm } from "@/components/forms/class-create-form";
import { Badge, ButtonLink, Card, PageHeader } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getClassesForTeacher, getTeacherClasses } from "@/lib/services/teacher-service";

export default async function KelasSayaPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { teacher } = await requireTeacherProfile();
  const params = await searchParams;
  const [classes, allClasses] = await Promise.all([
    getClassesForTeacher(teacher.id, params),
    getTeacherClasses(teacher.id)
  ]);
  const academicYears = Array.from(new Set(allClasses.map((item) => item.academicYear))).sort().reverse();
  return (
    <>
      <PageHeader title="Kelas Saya" description="Kelas ditampilkan sebagai ringkasan sebelum membuka daftar mahasiswa." />
      <Card title="Buat Kelas Baru" description="Kode kelas dibuat otomatis dan dibagikan ke mahasiswa untuk registrasi.">
        <ClassCreateForm />
      </Card>
      <Card>
        <form className="grid gap-3 sm:grid-cols-[1fr_150px_160px_160px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input name="q" className="form-input pl-9" placeholder="Cari kelas" defaultValue={typeof params.q === "string" ? params.q : ""} />
          </label>
          <select name="semester" className="form-input" defaultValue={typeof params.semester === "string" ? params.semester : ""}>
            <option value="">Semester</option>
            <option value="Genap">Genap</option>
            <option value="Ganjil">Ganjil</option>
          </select>
          <select name="academicYear" className="form-input" defaultValue={typeof params.academicYear === "string" ? params.academicYear : ""}>
            <option value="">Tahun Akademik</option>
            {academicYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
          <select name="sort" className="form-input" defaultValue={typeof params.sort === "string" ? params.sort : ""}>
            <option value="">Urutkan</option>
            <option value="progress">Progress</option>
            <option value="score">Rata-rata KAM</option>
          </select>
          <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Filter</button>
        </form>
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {classes.map((classItem) => (
          <Card key={classItem.id} title={classItem.name} action={<ButtonLink href={`/guru/kelas/${classItem.id}`}>Buka Kelas</ButtonLink>}>
            <div className="mb-3 inline-flex rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-red-900">
              Kode: {classItem.code}
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>Mahasiswa: <strong>{classItem.count}</strong></p>
              <p>Progress: <strong>{classItem.averageProgress}%</strong></p>
              <p>Rata-rata KAM: <strong>{classItem.averageKam}</strong></p>
              <p><Badge tone={classItem.attention ? "warning" : "success"}>{classItem.attention} perlu perhatian</Badge></p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

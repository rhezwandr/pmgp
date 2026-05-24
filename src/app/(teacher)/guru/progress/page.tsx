import Link from "next/link";

import { Badge, Card, PageHeader } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getProgressMahasiswa, getTeacherClasses, groupRowsByClass } from "@/lib/services/teacher-service";

export default async function ProgressMahasiswaPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { teacher } = await requireTeacherProfile();
  const params = await searchParams;
  const [students, classes] = await Promise.all([getProgressMahasiswa(teacher.id, params), getTeacherClasses(teacher.id)]);
  const grouped = groupRowsByClass(students);
  return (
    <>
      <PageHeader title="Progress Mahasiswa" description="Pantau progres lintas kelas dengan filter tahap dan status." />
      <Card>
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_220px_180px_auto]">
          <input name="q" className="form-input" placeholder="Cari mahasiswa" defaultValue={typeof params.q === "string" ? params.q : ""} />
          <select name="classId" className="form-input" defaultValue={typeof params.classId === "string" ? params.classId : ""}>
            <option value="">Semua Kelas</option>
            {classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name}</option>)}
          </select>
          <select name="status" className="form-input" defaultValue={typeof params.status === "string" ? params.status : ""}>
            <option value="">Semua Status</option>
            {["Belum Lulus KAM","Belum Pre Test","Sedang LKM 1-6","Post Test Terbuka","Selesai"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select name="missingFeedback" className="form-input" defaultValue={typeof params.missingFeedback === "string" ? params.missingFeedback : ""}>
            <option value="">Feedback</option>
            <option value="true">Belum mengisi feedback</option>
          </select>
          <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Filter</button>
        </form>
      </Card>
      <Card className="mt-4" title="Daftar Progress">
        <div className="space-y-6">
          {grouped.map((group) => (
            <section key={group.classId ?? group.className}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-stone-950">{group.className}</h2>
                <Badge tone="neutral">{group.rows.length} mahasiswa</Badge>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full">
                  <thead className="table-head"><tr>{["Nama","KAM","Pre Test","LKM (Status)","Modul","Post Test","Refleksi","Progress","Aksi"].map((head) => <th key={head} className="px-3 py-2">{head}</th>)}</tr></thead>
                  <tbody>
                    {group.rows.map((student) => (
                      <tr key={student.id}>
                        <td className="table-cell"><div className="font-semibold text-stone-950">{student.name}</div><div className="text-xs text-muted">{student.nim}</div></td>
                        <td className="table-cell">{student.kamStatus}</td>
                        <td className="table-cell">{student.preTestStatus}</td>
                        <td className="table-cell">{[student.lkmProgress[1], student.lkmProgress[2], student.lkmProgress[3], student.lkmProgress[4], student.lkmProgress[5], student.lkmProgress[6]].filter((s) => s === "✅").length}/6</td>
                        <td className="table-cell">{student.moduleProgress[1] ?? "-"}</td>
                        <td className="table-cell">{student.postTestStatus}</td>
                        <td className="table-cell">{student.feedbackStatus}</td>
                        <td className="table-cell"><Badge tone={student.needsAttention ? "warning" : "success"}>{student.progress}%</Badge></td>
                        <td className="table-cell"><Link className="font-semibold text-primary transition hover:text-primary-strong" href={`/guru/mahasiswa/${student.id}`}>Detail</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </Card>
    </>
  );
}

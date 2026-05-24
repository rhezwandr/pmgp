import { Printer } from "lucide-react";

import { ExportActions } from "@/components/forms/export-actions";
import { Badge, Card, PageHeader, SecondaryLink } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getRekapNilai, getTeacherClasses, groupRowsByClass } from "@/lib/services/teacher-service";

export default async function RekapNilaiPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { teacher } = await requireTeacherProfile();
  const params = await searchParams;
  const [rows, classes] = await Promise.all([getRekapNilai(teacher.id, params), getTeacherClasses(teacher.id)]);
  const grouped = groupRowsByClass(rows);
  const query = new URLSearchParams();
  if (typeof params.classId === "string" && params.classId) query.set("classId", params.classId);
  if (typeof params.status === "string" && params.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return (
    <>
      <PageHeader
        title="Rekap Nilai"
        description="Rekap nilai dipisahkan per kelas dengan ekspor Excel, PDF, dan dukungan cetak browser."
        action={<ExportActions excelHref={`/api/teacher/rekap/export/excel${suffix}`} pdfHref={`/api/teacher/rekap/export/pdf${suffix}`} />}
      />
      <Card title="Filter Rekap">
        <form className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <select name="classId" className="form-input" defaultValue={typeof params.classId === "string" ? params.classId : ""}>
            <option value="">Semua Kelas</option>
            {classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name}</option>)}
          </select>
          <select name="status" className="form-input" defaultValue={typeof params.status === "string" ? params.status : ""}>
            <option value="">Semua Status</option>
            <option value="Selesai">Selesai</option>
            <option value="Belum Selesai">Belum Selesai</option>
          </select>
          <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Terapkan</button>
        </form>
      </Card>
      <Card className="mt-4" action={<SecondaryLink href="#" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print report</SecondaryLink>}>
        <div className="space-y-6">
          {grouped.map((group) => (
            <section key={group.classId ?? group.className}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-stone-950">{group.className}</h2>
                <Badge tone="neutral">{group.rows.length} mahasiswa</Badge>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full">
                  <thead className="table-head"><tr>{["Name","NIM","KAM","Pre Test","LKM (Status)","Modul","Post Test","Final Status"].map((head) => <th key={head} className="px-3 py-2">{head}</th>)}</tr></thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr key={row.id}>
                        <td className="table-cell">{row.name}</td>
                        <td className="table-cell">{row.nim}</td>
                        <td className="table-cell">{row.kam ?? "-"}</td>
                        <td className="table-cell">{row.preTest ?? "-"}</td>
                        <td className="table-cell">{[row.lkm1, row.lkm2, row.lkm3].filter(Boolean).length > 0 ? `${[row.lkm1, row.lkm2, row.lkm3].filter(Boolean).length}/6 selesai` : "Belum"}</td>
                        <td className="table-cell">{row.averageScore > 0 ? "Sudah" : "Belum"}</td>
                        <td className="table-cell">{row.postTest ?? "-"}</td>
                        <td className="table-cell"><Badge tone={row.finalStatus === "Selesai" ? "success" : "warning"}>{row.finalStatus}</Badge></td>
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

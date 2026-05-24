import Link from "next/link";

import { ScoreLineChart } from "@/components/charts/score-line-chart";
import { Badge, ButtonLink, Card, PageHeader, ScoreCard } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getClassDashboard } from "@/lib/services/teacher-service";

export default async function ClassDashboardPage({ params }: { params: Promise<{ classId: string }> }) {
  await requireTeacherProfile();
  const { classId } = await params;
  const data = await getClassDashboard(classId);
  return (
    <>
      <PageHeader
        title={data.classItem.name}
        description={`${data.classItem.semester} ${data.classItem.academicYear} | Kode kelas: ${data.classItem.code}`}
        action={<ButtonLink href={`/api/teacher/classes/${classId}/export`}>Export Class Report</ButtonLink>}
      />
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Mahasiswa" value={data.students.length} />
          <ScoreCard label="Rata-rata Kelas" value={data.averageScore} />
          <ScoreCard label="Selesai Post Test" value={data.completion.postTest} />
          <ScoreCard label="Perlu Bantuan" value={data.needingAssistance.length} />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card title="Perkembangan Nilai Kelas"><ScoreLineChart data={data.chart} /></Card>
          <Card title="Persentase Penyelesaian">
            <div className="grid gap-2">
              {Object.entries(data.completion).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm"><span className="capitalize">{key}</span><span>{value}%</span></div>
                  <div className="h-2 rounded-full bg-red-50"><div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card title="Student Table">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="table-head"><tr>{["Name","NIM","KAM","Pre Test","LKM","Post Test","Progress","Status","Actions"].map((head) => <th key={head} className="px-3 py-2">{head}</th>)}</tr></thead>
              <tbody>
                {data.students.map((student) => (
                  <tr key={student.id}>
                    <td className="table-cell">{student.name}</td>
                    <td className="table-cell">{student.nim}</td>
                    <td className="table-cell">{student.kam ?? "-"}</td>
                    <td className="table-cell">{student.preTest ?? "-"}</td>
                    <td className="table-cell">{student.lkmCompleted}/6</td>
                    <td className="table-cell">{student.postTest ?? "-"}</td>
                    <td className="table-cell">{student.progress}%</td>
                    <td className="table-cell"><Badge tone={student.needsAttention ? "warning" : "success"}>{student.status}</Badge></td>
                    <td className="table-cell"><Link className="font-medium text-primary" href={`/guru/mahasiswa/${student.id}`}>Lihat Detail</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

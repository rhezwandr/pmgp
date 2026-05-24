import { SimpleBarChart } from "@/components/charts/score-line-chart";
import { Badge, Card, PageHeader } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getLaporanPembelajaran } from "@/lib/services/teacher-service";

export default async function LaporanPembelajaranPage() {
  const { teacher } = await requireTeacherProfile();
  const report = await getLaporanPembelajaran(teacher.id);
  return (
    <>
      <PageHeader title="Laporan Pembelajaran" description="Analitik kelas, perbandingan skor, topik lemah, dan rekomendasi tindakan." />
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Average Score per Class"><SimpleBarChart data={report.classChart} /></Card>
          <Card title="Pre Test vs Post Test"><SimpleBarChart data={report.prePostChart} /></Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Lulus KAM"><p className="text-3xl font-semibold">{report.passedKamPercentage}%</p></Card>
          <Card title="Penyelesaian LKM"><SimpleBarChart data={report.lkmCompletion} /></Card>
          <Card title="Topik Lemah Umum">
            <div className="space-y-2">{report.mostCommonWeakTopics.map((item) => <Badge key={item.topic} tone="warning">{item.topic} ({item.count})</Badge>)}</div>
          </Card>
        </div>
        <Card title="Students Needing Assistance">
          <div className="grid gap-2 lg:grid-cols-2">
            {report.studentsNeedingAssistance.map((student) => <p key={student.id} className="rounded-2xl border border-red-100 bg-red-50/60 p-3 text-sm text-stone-700">{student.name} - {student.className} - {student.status}</p>)}
          </div>
        </Card>
        <Card title="Recommended Teacher Actions">
          <p className="text-sm text-muted">{report.recommendations}</p>
        </Card>
      </div>
    </>
  );
}

import { Search } from "lucide-react";

import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getFeedbackAndPeerReport, getTeacherClasses } from "@/lib/services/teacher-service";

export default async function FeedbackPembelajaranPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { teacher } = await requireTeacherProfile();
  const params = await searchParams;
  const [classes, report] = await Promise.all([
    getTeacherClasses(teacher.id),
    getFeedbackAndPeerReport(teacher.id, params)
  ]);

  return (
    <>
      <PageHeader title="Feedback Pembelajaran dan Penilaian Sejawat" description="Laporan feedback mahasiswa dan peer assessment ditampilkan terpisah agar mudah dianalisis." />
      <Card title="Filter Laporan">
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_160px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input name="q" className="form-input pl-9" placeholder="Cari mahasiswa" defaultValue={typeof params.q === "string" ? params.q : ""} />
          </label>
          <select name="classId" className="form-input" defaultValue={typeof params.classId === "string" ? params.classId : ""}>
            <option value="">Semua Kelas</option>
            {classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name}</option>)}
          </select>
          <select name="lkm" className="form-input" defaultValue={typeof params.lkm === "string" ? params.lkm : ""}>
            <option value="">Semua LKM</option>
            <option value="1">LKM 1</option>
            <option value="2">LKM 2</option>
            <option value="3">LKM 3</option>
          </select>
          <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Terapkan</button>
        </form>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card
          title="Feedback Pembelajaran"
          description="Refleksi wajib mahasiswa setelah menyelesaikan LKM."
          action={<Badge tone="neutral">{report.stats.feedbackCount} feedback</Badge>}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <Metric label="Rating rata-rata" value={`${report.stats.averageRating}/5`} />
            <Metric label="Sudah mengisi" value={report.stats.studentsWithFeedback} />
            <Metric label="Belum mengisi" value={report.stats.studentsWithoutFeedback} />
          </div>
          {report.feedbackRows.length === 0 ? (
            <EmptyState title="Belum ada feedback" description="Feedback mahasiswa akan tampil setelah mereka mengisi refleksi wajib." />
          ) : (
            <div className="space-y-3">
              {report.feedbackRows.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border bg-white p-3 text-sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-stone-950">{item.student.user.name}</p>
                    <Badge tone="neutral">{item.student.class?.name ?? "-"}</Badge>
                    <Badge tone="success">{item.lkm.title}</Badge>
                    <Badge tone="warning">Rating {item.rating}/5</Badge>
                  </div>
                  <p className="leading-6 text-muted">{item.reflectionText}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          title="Laporan Penilaian Sejawat"
          description="Penilaian sejawat bersifat opsional dan tidak mengunci tahap berikutnya."
          action={<Badge tone="neutral">{report.stats.peerAssessmentCount} laporan</Badge>}
        >
          {report.peerRows.length === 0 ? (
            <EmptyState title="Belum ada penilaian sejawat" description="Mahasiswa dapat mengisi atau melewati penilaian sejawat." />
          ) : (
            <div className="space-y-3">
              {report.peerRows.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border bg-white p-3 text-sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-stone-950">{item.student.user.name}</p>
                    <Badge tone="neutral">{item.student.class?.name ?? "-"}</Badge>
                    <Badge tone="success">{item.lkm.title}</Badge>
                  </div>
                  <p className="text-muted">Menilai: {item.assessedFriendName}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
                    <span>Kontribusi {item.contributionScore}/5</span>
                    <span>Komunikasi {item.communicationScore}/5</span>
                    <span>Tanggung jawab {item.responsibilityScore}/5</span>
                    <span>Kolaborasi {item.collaborationScore}/5</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3">
      <p className="text-xs font-semibold uppercase text-red-900">{label}</p>
      <p className="mt-1 text-xl font-semibold text-stone-950">{value}</p>
    </div>
  );
}

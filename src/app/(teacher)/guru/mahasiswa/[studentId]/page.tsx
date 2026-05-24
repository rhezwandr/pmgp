import { TeacherNoteForm } from "@/components/forms/teacher-note-form";
import { TeacherMessageForm } from "@/components/forms/teacher-message-form";
import { Badge, Card, PageHeader, ScoreCard } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getStudentDetailForTeacher } from "@/lib/services/teacher-service";

export default async function StudentDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  await requireTeacherProfile();
  const { studentId } = await params;
  const data = await getStudentDetailForTeacher(studentId);
  const overview = data.overview;
  return (
    <>
      <PageHeader title={data.student.user.name} description={`${data.student.nim} | ${data.student.class?.name ?? "-"} | ${overview?.status ?? "-"}`} />
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ScoreCard label="KAM" value={overview?.kam ?? null} />
          <ScoreCard label="Pre Test" value={overview?.preTest ?? null} />
          <ScoreCard label="Post Test" value={overview?.postTest ?? null} />
        </div>
        <Card title="Status LKM & Modul">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const key = `lkm${n}` as keyof typeof overview;
              const submitted = overview?.[key] !== null && overview?.[key] !== undefined;
              return (
                <div key={n} className={`rounded-xl border p-3 text-center text-sm ${submitted ? "border-green-200 bg-green-50" : "border-border bg-white"}`}>
                  <p className="font-semibold">LKM {n}</p>
                  <p className={`mt-1 text-xs ${submitted ? "text-green-700" : "text-muted"}`}>{submitted ? "✅ Sudah" : "Belum"}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <a href={`/guru/lkm-feedback?studentId=${studentId}`} className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong">
              Beri Feedback LKM Mahasiswa Ini
            </a>
          </div>
        </Card>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card title="Automatic Feedback History">
            <div className="space-y-3">
              {data.feedback.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border p-3 text-sm">
                  <div className="mb-2 flex gap-2"><Badge tone="neutral">{item.sourceType}</Badge><Badge tone="success">{item.score}</Badge></div>
                  <p className="text-muted">{item.recommendation}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card title="System Recommendation">
            <p className="text-sm text-muted">{data.recommendation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.weakTopics.map((topic) => <Badge key={topic} tone="warning">{topic}</Badge>)}
            </div>
          </Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card title="Learning Feedback">
            <div className="space-y-3">
              {data.learningFeedback.map((item) => <p key={item.id} className="rounded-2xl border border-border p-3 text-sm text-muted">{item.lkm.title}: {item.reflectionText}</p>)}
            </div>
          </Card>
          <Card title="Peer Assessment">
            <div className="space-y-3">
              {data.peerAssessments.map((item) => (
                <p key={item.id} className="rounded-2xl border border-border p-3 text-sm text-muted">{item.lkm.title}: {item.assessedFriendName} | Kontribusi {item.contributionScore}, Komunikasi {item.communicationScore}</p>
              ))}
            </div>
          </Card>
        </div>
        <Card title="Teacher Notes">
          <TeacherNoteForm studentId={studentId} />
          <div className="mt-4 space-y-2">
            {data.notes.map((note) => <p key={note.id} className="rounded-2xl border border-red-100 bg-red-50/60 p-3 text-sm text-stone-700">{note.noteText}</p>)}
          </div>
        </Card>
        <Card title="Kirim Pesan ke Mahasiswa" description="Pesan akan muncul di halaman Notifikasi mahasiswa dan ditandai belum dibaca.">
          <TeacherMessageForm studentId={studentId} />
        </Card>
      </div>
    </>
  );
}

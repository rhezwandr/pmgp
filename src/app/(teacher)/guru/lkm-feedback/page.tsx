import { Card, EmptyState, PageHeader } from "@/components/ui";
import { TeacherLkmFeedbackPanel } from "@/components/forms/teacher-lkm-feedback";
import { prisma } from "@/lib/prisma";
import { requireTeacherProfile } from "@/lib/route-guards";

export default async function TeacherLkmFeedbackPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { teacher } = await requireTeacherProfile();
  const params = await searchParams;
  const selectedStudentId = typeof params.studentId === "string" ? params.studentId : "";

  // Get all students from teacher's classes
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    include: {
      students: {
        include: {
          user: { select: { name: true } },
          lkmSubmissions: { include: { lkm: true } }
        }
      }
    }
  });

  const allStudents = classes.flatMap((cls) =>
    cls.students.map((s) => ({ id: s.id, name: s.user.name, className: cls.name }))
  );

  // Deduplicate students
  const studentMap = new Map<string, { id: string; name: string; className: string }>();
  for (const s of allStudents) studentMap.set(s.id, s);
  const students = Array.from(studentMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Get selected student's LKM data
  let studentLkmData: Array<{
    lkmId: string;
    lkmNumber: number;
    lkmTitle: string;
    status: string;
    answerText: string;
    existingFeedback: string | null;
    studentReflection: string | null;
    studentRating: number | null;
  }> = [];

  if (selectedStudentId) {
    const lkms = await prisma.lKM.findMany({ orderBy: { number: "asc" } });
    const submissions = await prisma.studentLKMSubmission.findMany({
      where: { studentId: selectedStudentId }
    });
    const feedbacks = await prisma.teacherLkmFeedback.findMany({
      where: { studentId: selectedStudentId, teacherId: teacher.id }
    });
    const learningFeedbacks = await prisma.learningFeedback.findMany({
      where: { studentId: selectedStudentId }
    });

    const submissionMap = new Map(submissions.map((s) => [s.lkmId, s]));
    const feedbackMap = new Map(feedbacks.map((f) => [f.lkmId, f]));
    const learningFeedbackMap = new Map(learningFeedbacks.map((f) => [f.lkmId, f]));

    studentLkmData = lkms.map((lkm) => {
      const sub = submissionMap.get(lkm.id);
      const fb = feedbackMap.get(lkm.id);
      const lf = learningFeedbackMap.get(lkm.id);
      return {
        lkmId: lkm.id,
        lkmNumber: lkm.number,
        lkmTitle: lkm.title,
        status: sub ? sub.status : "NOT_STARTED",
        answerText: sub?.answerText ?? "",
        existingFeedback: fb?.feedbackText ?? null,
        studentReflection: lf?.reflectionText ?? null,
        studentRating: lf?.rating ?? null
      };
    });
  }

  return (
    <>
      <PageHeader title="Feedback LKM Mahasiswa" description="Pilih mahasiswa, lihat jawaban LKM, dan berikan feedback kualitatif." />

      <Card title="Pilih Mahasiswa">
        <form className="flex flex-wrap gap-3">
          <select name="studentId" className="form-input max-w-md" defaultValue={selectedStudentId}>
            <option value="">— Pilih mahasiswa —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
            ))}
          </select>
          <button className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong">
            Tampilkan
          </button>
        </form>
      </Card>

      {selectedStudentId && studentLkmData.length > 0 && (
        <div className="mt-6 space-y-4">
          {studentLkmData.map((item) => (
            <Card key={item.lkmId} title={item.lkmTitle}>
              {item.status === "NOT_STARTED" ? (
                <EmptyState title="Belum dikerjakan" description="Mahasiswa belum mengerjakan LKM ini." />
              ) : (
                <TeacherLkmFeedbackPanel
                  studentId={selectedStudentId}
                  lkmId={item.lkmId}
                  lkmNumber={item.lkmNumber}
                  answerText={item.answerText}
                  existingFeedback={item.existingFeedback}
                  status={item.status}
                  studentReflection={item.studentReflection}
                  studentRating={item.studentRating}
                />
              )}
            </Card>
          ))}
        </div>
      )}

      {selectedStudentId && studentLkmData.length === 0 && (
        <EmptyState title="Tidak ada data LKM" description="Belum ada LKM yang tersedia." />
      )}
    </>
  );
}

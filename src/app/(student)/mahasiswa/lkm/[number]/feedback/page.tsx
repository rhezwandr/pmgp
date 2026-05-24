import { redirect } from "next/navigation";

import { LearningFeedbackForm } from "@/components/forms/lkm-forms";
import { Card, PageHeader } from "@/components/ui";
import { requireStudentProfile } from "@/lib/route-guards";
import { getLkmForStudent } from "@/lib/services/student-service";

export default async function LearningFeedbackPage({ params }: { params: Promise<{ number: string }> }) {
  const { student } = await requireStudentProfile();
  const { number } = await params;
  const num = Number(number);
  const lkm = await getLkmForStudent(student.id, num);

  // Must have submitted LKM first
  const submission = lkm.submissions[0];
  if (!submission || !submission.submittedAt) redirect(`/mahasiswa/lkm/${num}/attempt`);

  // If already submitted feedback, go to result
  const existingFeedback = lkm.learningFeedback[0];
  if (existingFeedback) redirect(`/mahasiswa/lkm/${num}/result`);

  return (
    <>
      <PageHeader
        title={`Refleksi & Penilaian — ${lkm.title}`}
        description="Ceritakan pengalaman belajar Anda dan beri penilaian untuk LKM ini. Minimal 20 karakter. Wajib diisi untuk melanjutkan ke LKM berikutnya."
      />
      <Card title="Refleksi Pengalaman Belajar">
        <LearningFeedbackForm number={num} />
      </Card>
    </>
  );
}

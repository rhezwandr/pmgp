import { LkmContentForm } from "@/components/forms/lkm-forms";
import { LkmSecurityWrapper } from "@/components/forms/lkm-security-wrapper";
import { PageHeader } from "@/components/ui";
import { lkmContents } from "@/lib/lkm-content";
import { requireStudentProfile } from "@/lib/route-guards";
import { getLkmForStudent } from "@/lib/services/student-service";

export default async function LkmAttemptPage({ params }: { params: Promise<{ number: string }> }) {
  const { student } = await requireStudentProfile();
  const { number } = await params;
  const num = Number(number);
  const lkm = await getLkmForStudent(student.id, num);
  const content = lkmContents.find((l) => l.lkmNumber === num);
  const existingAnswer = lkm.submissions[0]?.answerText ?? "";

  if (!content) {
    return <PageHeader title={`LKM ${num}`} description="Konten LKM belum tersedia." />;
  }

  return (
    <>
      <PageHeader title={content.title} description={content.focusTitle} />
      <LkmSecurityWrapper lkmNumber={num}>
        <LkmContentForm
          number={num}
          content={content}
          existingAnswer={existingAnswer}
        />
      </LkmSecurityWrapper>
    </>
  );
}

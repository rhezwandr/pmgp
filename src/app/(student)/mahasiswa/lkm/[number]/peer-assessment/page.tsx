import { PeerAssessmentForm } from "@/components/forms/lkm-forms";
import { Card, PageHeader } from "@/components/ui";
import { requireStudentProfile } from "@/lib/route-guards";
import { getLkmForStudent } from "@/lib/services/student-service";

export default async function PeerAssessmentPage({ params }: { params: Promise<{ number: string }> }) {
  const { student } = await requireStudentProfile();
  const { number } = await params;
  const lkm = await getLkmForStudent(student.id, Number(number));
  return (
    <>
      <PageHeader title={`Penilaian Sejawat ${lkm.title}`} description="Opsional. Anda dapat menyimpan atau melewati tahap ini." />
      <Card>
        <PeerAssessmentForm number={lkm.number} />
      </Card>
    </>
  );
}

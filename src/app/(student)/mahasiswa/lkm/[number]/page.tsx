import { Badge, ButtonLink, Card, PageHeader, SecondaryLink } from "@/components/ui";
import { requireStudentProfile } from "@/lib/route-guards";
import { getLkmForStudent } from "@/lib/services/student-service";

export default async function LkmIntroPage({ params }: { params: Promise<{ number: string }> }) {
  const { student } = await requireStudentProfile();
  const { number } = await params;
  const lkm = await getLkmForStudent(student.id, Number(number));
  const submission = lkm.submissions[0] ?? null;

  const statusLabel = !submission
    ? "Belum dikerjakan"
    : submission.status === "DRAFT"
      ? "Draft"
      : "Sudah submit";

  const statusTone = !submission ? "neutral" : submission.status === "DRAFT" ? "warning" : "success";

  return (
    <>
      <PageHeader title={lkm.title} description={lkm.description} />
      <Card title="Informasi LKM" action={<Badge tone={statusTone as "neutral" | "warning" | "success"}>{statusLabel}</Badge>}>
        <div className="space-y-3 text-sm text-muted">
          <p><strong className="text-stone-800">Nomor:</strong> LKM {lkm.number}</p>
          <p><strong className="text-stone-800">Topik:</strong> {lkm.topic}</p>
          <p><strong className="text-stone-800">Estimasi Waktu:</strong> 60 menit</p>
          <p><strong className="text-stone-800">Petunjuk:</strong> {lkm.instruction}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {!submission && (
            <ButtonLink href={`/mahasiswa/lkm/${lkm.number}/attempt`}>Mulai LKM</ButtonLink>
          )}
          {submission && submission.status === "DRAFT" && (
            <ButtonLink href={`/mahasiswa/lkm/${lkm.number}/attempt`}>Lanjutkan</ButtonLink>
          )}
          {submission && submission.status === "SUBMITTED" && (
            <SecondaryLink href={`/mahasiswa/lkm/${lkm.number}/result`}>Lihat Jawaban Saya</SecondaryLink>
          )}
        </div>
      </Card>
    </>
  );
}

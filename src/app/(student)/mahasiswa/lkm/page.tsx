import { Badge, ButtonLink, Card, PageHeader } from "@/components/ui";
import { guardStudentAccess } from "@/lib/route-guards";
import { getLkmListForStudent } from "@/lib/services/student-service";

export default async function LkmListPage() {
  const { student } = await guardStudentAccess("lkm1");
  const lkms = await getLkmListForStudent(student.id);
  return (
    <>
      <PageHeader title="LKM" description="LKM dikerjakan berurutan. Feedback pembelajaran wajib untuk membuka tahap berikutnya." />
      <div className="grid gap-4 lg:grid-cols-3">
        {lkms.map((lkm) => (
          <Card key={lkm.id} title={lkm.title} description={lkm.description}>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge tone="neutral">{lkm.topic}</Badge>
              <Badge tone={lkm.submission ? "success" : "neutral"}>{lkm.submission ? "Submitted" : "Belum Submit"}</Badge>
              <Badge tone={lkm.feedback ? "success" : "warning"}>{lkm.feedback ? "Feedback selesai" : "Feedback wajib"}</Badge>
            </div>
            {lkm.canAccess ? <ButtonLink href={`/mahasiswa/lkm/${lkm.number}`}>Buka LKM</ButtonLink> : <p className="text-sm text-muted">{lkm.lockReason}</p>}
          </Card>
        ))}
      </div>
    </>
  );
}

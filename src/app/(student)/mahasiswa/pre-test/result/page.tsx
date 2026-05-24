import { redirect } from "next/navigation";

import { Badge, ButtonLink, Card, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { guardStudentAccess } from "@/lib/route-guards";
import { getLatestTestAttempt } from "@/lib/services/student-service";

export default async function PreTestResultPage() {
  const { student } = await guardStudentAccess("preTest");
  const attempt = await getLatestTestAttempt(student.id, "PRE_TEST");
  if (!attempt) redirect("/mahasiswa/pre-test");
  const feedback = await prisma.automaticFeedback.findFirst({ where: { studentId: student.id, sourceId: attempt.id } });
  return (
    <>
      <PageHeader title="Hasil Pre Test" description="Nilai disimpan ke dashboard dan menjadi pembanding Post Test." />
      <Card title="Ringkasan Pre Test" action={<Badge tone="neutral">Skor {attempt.score}</Badge>}>
        <p className="text-sm text-muted">{feedback?.recommendation}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {feedback?.strongTopics.map((topic) => <Badge key={topic} tone="success">{topic}</Badge>)}
          {feedback?.weakTopics.map((topic) => <Badge key={topic} tone="warning">{topic}</Badge>)}
        </div>
        <div className="mt-5">
          <ButtonLink href="/mahasiswa/lkm/1">Lanjut ke LKM 1</ButtonLink>
        </div>
      </Card>
    </>
  );
}

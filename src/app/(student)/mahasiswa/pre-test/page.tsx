import { ButtonLink, Card, PageHeader } from "@/components/ui";
import { guardStudentAccess } from "@/lib/route-guards";
import { getLatestTestAttempt } from "@/lib/services/student-service";
import { redirect } from "next/navigation";

export default async function PreTestIntroPage() {
  const { student } = await guardStudentAccess("preTest");
  const attempt = await getLatestTestAttempt(student.id, "PRE_TEST");
  if (attempt) redirect("/mahasiswa/pre-test/result");
  return (
    <>
      <PageHeader title="Pre Test" description="Pre Test mengukur kemampuan awal sebelum rangkaian LKM. Nilai ini tidak menghambat Anda melanjutkan belajar." />
      <Card title="Tujuan Pre Test">
        <p className="text-sm text-muted">Nilai Pre Test akan dibandingkan dengan Post Test untuk melihat peningkatan belajar setelah menyelesaikan LKM 1, LKM 2, dan LKM 3.</p>
        <div className="mt-5">
          <ButtonLink href="/mahasiswa/pre-test/attempt">Mulai Pre Test</ButtonLink>
        </div>
      </Card>
    </>
  );
}

import { ButtonLink, Card, PageHeader } from "@/components/ui";
import { guardStudentAccess } from "@/lib/route-guards";
import { getLatestTestAttempt } from "@/lib/services/student-service";
import { redirect } from "next/navigation";

export default async function PostTestIntroPage() {
  const { student } = await guardStudentAccess("postTest");
  const attempt = await getLatestTestAttempt(student.id, "POST_TEST");
  if (attempt) redirect("/mahasiswa/post-test/result");
  return (
    <>
      <PageHeader title="Post Test" description="Post Test mengukur capaian setelah seluruh LKM, feedback, dan Modul Ajar selesai dipelajari." />
      <Card title="Tujuan Post Test">
        <p className="text-sm text-muted">Nilai Post Test akan dibandingkan dengan Pre Test untuk melihat peningkatan kemampuan matematis. Sistem tidak membuka tahap ini sebelum progres belajar Modul Ajar selesai.</p>
        <div className="mt-5">
          <ButtonLink href="/mahasiswa/post-test/attempt">Mulai Post Test</ButtonLink>
        </div>
      </Card>
    </>
  );
}

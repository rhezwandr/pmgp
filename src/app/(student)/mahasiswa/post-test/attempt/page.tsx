import { TestAttemptForm } from "@/components/forms/test-attempt-form";
import { PageHeader } from "@/components/ui";
import { guardStudentAccess } from "@/lib/route-guards";
import { getTestForAttempt } from "@/lib/services/student-service";

export default async function PostTestAttemptPage() {
  await guardStudentAccess("postTest");
  const test = await getTestForAttempt("POST_TEST");
  return (
    <>
      <PageHeader title="Post Test" description="Kerjakan semua soal untuk memperoleh hasil akhir." />
      <TestAttemptForm questions={test.questions} durationMinutes={test.durationMinutes} submitEndpoint="/api/student/post-test/submit" resultPath="/mahasiswa/post-test/result" />
    </>
  );
}

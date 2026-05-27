import { TestAttemptForm } from "@/components/forms/test-attempt-form";
import { PageHeader } from "@/components/ui";
import { guardStudentAccess } from "@/lib/route-guards";
import { getTestForStudentAttemptSecure } from "@/lib/services/student-service";

export default async function PreTestAttemptPage() {
  const { student } = await guardStudentAccess("preTest");
  const test = await getTestForStudentAttemptSecure("PRE_TEST");
  return (
    <>
      <PageHeader title="Pre Test" description="Kerjakan semua soal, lalu submit untuk membuka LKM 1." />
      <TestAttemptForm questions={test.questions} durationMinutes={test.durationMinutes} submitEndpoint="/api/student/pre-test/submit" resultPath="/mahasiswa/pre-test/result" shuffleSeed={student.id + "PRE_TEST"} testType="PRE_TEST" />
    </>
  );
}

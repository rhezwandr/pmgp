import { redirect } from "next/navigation";

import { TestAttemptForm } from "@/components/forms/test-attempt-form";
import { PageHeader } from "@/components/ui";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { requireStudentProfile } from "@/lib/route-guards";
import { getTestForStudentAttemptSecure } from "@/lib/services/student-service";

export default async function TesKamAttemptPage() {
  const { student } = await requireStudentProfile();
  const access = await getStudentLearningAccess(student.id);
  if (access.hasPassedKAM) redirect("/mahasiswa/dashboard");
  if (access.hasCompletedKAM && !access.canRetakeKAM) redirect("/mahasiswa/modul");
  const test = await getTestForStudentAttemptSecure("KAM");
  return (
    <>
      <PageHeader title="Tes KAM" description="Pilih jawaban terbaik untuk setiap soal." />
      <TestAttemptForm questions={test.questions} durationMinutes={test.durationMinutes} submitEndpoint="/api/student/kam/submit" resultPath="/mahasiswa/tes-kam/result" shuffleSeed={student.id + "KAM"} testType="KAM" />
    </>
  );
}

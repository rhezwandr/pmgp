import { redirect } from "next/navigation";

import { Badge, ButtonLink, Card, PageHeader, SecondaryLink } from "@/components/ui";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { requireStudentProfile } from "@/lib/route-guards";
import { getLatestTestAttempt, getTestForAttempt } from "@/lib/services/student-service";

export default async function TesKamIntroPage() {
  const { student } = await requireStudentProfile();
  const [access, test, attempt] = await Promise.all([getStudentLearningAccess(student.id), getTestForAttempt("KAM"), getLatestTestAttempt(student.id, "KAM")]);
  if (attempt && (!access.canRetakeKAM || access.hasPassedKAM)) redirect("/mahasiswa/tes-kam/result");

  return (
    <>
      <PageHeader title="Tes Kemampuan Awal Matematis" description="Tes ini menentukan apakah Anda dapat langsung memasuki alur utama atau perlu Modul Prasyarat." />
      <Card
        title={test.title}
        description={test.description}
        action={<Badge tone="neutral">KKM {test.kkm}</Badge>}
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <Info label="Jumlah Soal" value={`${test.questions.length} soal`} />
          <Info label="Durasi" value={`${test.durationMinutes} menit`} />
          <Info label="Status" value={access.canRetakeKAM ? "Siap ulang Tes KAM" : access.hasCompletedKAM ? "Perlu Modul Prasyarat" : "Belum dikerjakan"} />
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href="/mahasiswa/tes-kam/attempt">Mulai Tes KAM</ButtonLink>
          {access.hasCompletedKAM && <SecondaryLink href="/mahasiswa/tes-kam/result">Tinjau Hasil</SecondaryLink>}
        </div>
      </Card>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3">
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-stone-950">{value}</dd>
    </div>
  );
}

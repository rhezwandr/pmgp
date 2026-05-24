import { Badge, Card, PageHeader, ButtonLink } from "@/components/ui";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { requireStudentProfile } from "@/lib/route-guards";
import { getModulesForStudent } from "@/lib/services/student-service";

export default async function ModulPage() {
  const { student } = await requireStudentProfile();
  const [modules, access] = await Promise.all([getModulesForStudent(student.id), getStudentLearningAccess(student.id)]);

  return (
    <>
      <PageHeader title="Modul Ajar / Modul Prasyarat" description="Mahasiswa harus membuka materi, membaca bagian wajib, dan menulis refleksi sebelum modul dianggap selesai." />
      <div className="grid gap-4 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} title={module.title} description={module.description}>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge tone="neutral">{module.topic}</Badge>
              {module.isPrerequisite && <Badge tone="warning">Wajib Dipelajari</Badge>}
              {module.emphasized && <Badge tone="warning">Direkomendasikan Sistem</Badge>}
              <Badge tone={module.progress === "COMPLETED" ? "success" : "neutral"}>{module.progress === "COMPLETED" ? "Selesai" : "Belum Selesai"}</Badge>
            </div>
            <p className="text-sm text-muted">{module.content}</p>
            <div className="mt-4 rounded-2xl border border-border bg-white p-3 text-sm">
              <p className="font-semibold text-stone-950">Tujuan Pembelajaran</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                {module.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
              <p className="mt-3 text-xs text-muted">Estimasi belajar {module.estimatedMinutes} menit. Selesaikan {module.requiredSectionCount} bagian materi wajib.</p>
            </div>
            <div className="mt-4">
              <ButtonLink href={`/mahasiswa/modul/${module.id}`}>
                {module.progress === "NOT_STARTED" ? "Mulai Pelajari Modul" : "Buka Detail Modul"}
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
      {access.canRetakeKAM && (
        <div className="mt-5">
          <ButtonLink href="/mahasiswa/tes-kam/attempt">Ulang Tes KAM</ButtonLink>
        </div>
      )}
    </>
  );
}

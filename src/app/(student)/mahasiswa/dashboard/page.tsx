import { ProgressStepper } from "@/components/progress-stepper";
import { Badge, ButtonLink, Card, PageHeader, SecondaryLink } from "@/components/ui";
import { PROGRESS_STEPS, STUDENT_STAGE_LABELS } from "@/lib/constants";
import { guardStudentAccess } from "@/lib/route-guards";

export default async function DashboardMahasiswaPage() {
  const { student, access } = await guardStudentAccess("dashboard");

  const stageHref: Record<string, string> = {
    TES_KAM: "/mahasiswa/tes-kam",
    MODUL_REMEDIAL: "/mahasiswa/modul",
    PRE_TEST: "/mahasiswa/pre-test",
    LKM_1: "/mahasiswa/lkm/1",
    LKM_2: "/mahasiswa/lkm/2",
    LKM_3: "/mahasiswa/lkm/3",
    LKM_4: "/mahasiswa/lkm/4",
    LKM_5: "/mahasiswa/lkm/5",
    LKM_6: "/mahasiswa/lkm/6",
    POST_TEST: "/mahasiswa/post-test",
    HASIL: "/mahasiswa/final-result"
  };

  const stageActions: Record<string, { label: string; href: string }[]> = {
    TES_KAM: [{ label: "Mulai Tes KAM", href: "/mahasiswa/tes-kam" }],
    MODUL_REMEDIAL: [
      { label: "Buka Modul Remedial", href: "/mahasiswa/modul" },
      { label: "Lihat Hasil KAM", href: "/mahasiswa/tes-kam/result" }
    ],
    PRE_TEST: [{ label: "Mulai Pre Test", href: "/mahasiswa/pre-test" }],
    LKM_1: [{ label: "Mulai LKM 1", href: "/mahasiswa/lkm/1" }],
    LKM_2: [{ label: "Mulai LKM 2", href: "/mahasiswa/lkm/2" }],
    LKM_3: [{ label: "Mulai LKM 3", href: "/mahasiswa/lkm/3" }],
    LKM_4: [{ label: "Mulai LKM 4", href: "/mahasiswa/lkm/4" }],
    LKM_5: [{ label: "Mulai LKM 5", href: "/mahasiswa/lkm/5" }],
    LKM_6: [{ label: "Mulai LKM 6", href: "/mahasiswa/lkm/6" }],
    POST_TEST: [{ label: "Mulai Post Test", href: "/mahasiswa/post-test" }],
    HASIL: [{ label: "Lihat Hasil Akhir", href: "/mahasiswa/final-result" }]
  };

  const activeActions = stageActions[access.activeStage] ?? [];

  // Build step status
  const completedStages = new Set<string>();
  const stageOrder: (keyof typeof STUDENT_STAGE_LABELS)[] = [
    "TES_KAM", "MODUL_REMEDIAL", "PRE_TEST",
    "LKM_1", "LKM_2", "LKM_3", "LKM_4", "LKM_5", "LKM_6",
    "POST_TEST", "HASIL"
  ];
  let foundActive = false;
  for (const stage of stageOrder) {
    if (stage === access.activeStage) {
      foundActive = true;
      break;
    }
    completedStages.add(STUDENT_STAGE_LABELS[stage]);
  }

  return (
    <>
      <PageHeader
        title="Dashboard Mahasiswa"
        description="Progres pembelajaran dan tindakan berikutnya."
        action={<Badge tone="neutral">Tahap aktif: {STUDENT_STAGE_LABELS[access.activeStage]}</Badge>}
      />
      <div className="grid gap-4">
        {/* Progress Stepper */}
        <Card title="Progres Pembelajaran" description={`${access.progressPercentage}% selesai`}>
          <ProgressStepper access={access} />
        </Card>

        {/* Step Detail */}
        <Card title="Detail Tahap Pembelajaran">
          <div className="space-y-2">
            {PROGRESS_STEPS.map((step) => {
              const isCompleted = completedStages.has(step);
              const isActive = step === STUDENT_STAGE_LABELS[access.activeStage];
              const isLocked = !isCompleted && !isActive;

              let icon = "🔒";
              let textClass = "text-muted";
              if (isCompleted) { icon = "✅"; textClass = "text-green-700"; }
              else if (isActive) { icon = "→"; textClass = "text-primary font-semibold"; }

              // Find lock reason for this step
              const lockKey = Object.entries(STUDENT_STAGE_LABELS).find(([, v]) => v === step)?.[0];
              const lockReason = lockKey ? access.lockReasons[lockKey.toLowerCase().replace(/_/g, "")] ?? access.lockReasons[`lkm${step.replace("LKM ", "")}`] : undefined;

              return (
                <div key={step} className={`flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm ${isActive ? "border-red-200 bg-red-50/60" : "bg-white"}`}>
                  <span className="w-6 text-center">{icon}</span>
                  <span className={textClass}>{step}</span>
                  {isLocked && lockReason && (
                    <span className="ml-auto text-xs text-muted">{lockReason}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <Card title="Tindakan Berikutnya">
          <div className="flex flex-wrap gap-2">
            {activeActions.map((action) => (
              <ButtonLink key={action.href} href={action.href}>{action.label}</ButtonLink>
            ))}
            <SecondaryLink href="/mahasiswa/lkm">Daftar LKM</SecondaryLink>
            <SecondaryLink href="/mahasiswa/notifikasi">Notifikasi</SecondaryLink>
          </div>
        </Card>

        {/* Lock Reasons */}
        {Object.keys(access.lockReasons).length > 0 && (
          <Card title="Tahap Terkunci">
            <div className="space-y-2">
              {Object.values(access.lockReasons).map((reason) => (
                <p key={reason} className="rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-sm text-muted">🔒 {reason}</p>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

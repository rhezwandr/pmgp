import { Check, Lock } from "lucide-react";

import { PROGRESS_STEPS } from "@/lib/constants";
import type { StudentLearningAccess } from "@/lib/learning-access";

export function ProgressStepper({ access }: { access: StudentLearningAccess }) {
  const completeMap: Record<string, boolean> = {
    "Tes KAM": access.hasCompletedKAM && access.hasPassedKAM,
    "Modul Remedial": !access.needsPrerequisiteModules || access.hasCompletedPrerequisiteModules,
    "Pre Test": access.canAccessLKM1,
    "LKM 1": access.canAccessLKM2,
    "LKM 2": access.canAccessLKM3,
    "LKM 3": access.canAccessLKM4,
    "LKM 4": access.canAccessLKM5,
    "LKM 5": access.canAccessLKM6,
    "LKM 6": access.canAccessPostTest,
    "Post Test": access.activeStage === "HASIL",
    Hasil: access.activeStage === "HASIL"
  };

  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {PROGRESS_STEPS.map((step) => {
        const complete = completeMap[step] ?? false;
        return (
          <li key={step} className="flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-stone-700 shadow-subtle">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${complete ? "border-red-200 bg-red-50 text-primary" : "border-stone-200 text-locked"}`}>
              {complete ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            </span>
            {step}
          </li>
        );
      })}
    </ol>
  );
}

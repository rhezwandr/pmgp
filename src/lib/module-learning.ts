import type { Prisma } from "@prisma/client";

export type ModuleSection = {
  title: string;
  content: string;
};

export type ModuleCompletionGate = {
  readSectionCount: number;
  readProgress: number;
  requiredSectionCount: number;
  reflectionText?: string | null;
};

export function normalizeModuleSections(sections: Prisma.JsonValue | null | undefined, fallbackContent: string): ModuleSection[] {
  if (Array.isArray(sections)) {
    const normalized = sections
      .map((section) => {
        if (!section || typeof section !== "object" || Array.isArray(section)) return null;
        const item = section as Record<string, unknown>;
        if (typeof item.title !== "string" || typeof item.content !== "string") return null;
        return { title: item.title, content: item.content };
      })
      .filter((section): section is ModuleSection => Boolean(section));

    if (normalized.length > 0) return normalized;
  }

  return [{ title: "Materi Utama", content: fallbackContent }];
}

export function calculateModuleReadProgress(readSectionCount: number, requiredSectionCount: number) {
  if (requiredSectionCount <= 0) return 100;
  return Math.min(100, Math.round((Math.max(0, readSectionCount) / requiredSectionCount) * 100));
}

export function getEffectiveRequiredSectionCount(requiredSectionCount: number, sections: ModuleSection[]) {
  return Math.max(1, Math.min(requiredSectionCount, sections.length));
}

export function canCompleteModuleStudy(gate: ModuleCompletionGate) {
  const hasReadRequiredSections = gate.readSectionCount >= gate.requiredSectionCount && gate.readProgress >= 100;
  const hasReflection = Boolean(gate.reflectionText?.trim());
  return hasReadRequiredSections && hasReflection;
}

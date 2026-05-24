import { TOPICS } from "./constants";

export type FeedbackTestType = "KAM" | "PRE_TEST" | "LKM" | "POST_TEST";

export type AutomaticFeedbackResult = {
  score: number;
  achievementStatus: "Sangat Baik" | "Baik" | "Cukup" | "Perlu Pendampingan";
  strongTopics: string[];
  weakTopics: string[];
  recommendation: string;
  nextAction: string;
};

export function getAchievementStatus(score: number): AutomaticFeedbackResult["achievementStatus"] {
  if (score >= 85) return "Sangat Baik";
  if (score >= 70) return "Baik";
  if (score >= 60) return "Cukup";
  return "Perlu Pendampingan";
}

export function generateAutomaticFeedback(
  score: number,
  testType: FeedbackTestType,
  topicBreakdown: Record<string, number>
): AutomaticFeedbackResult {
  const achievementStatus = getAchievementStatus(score);
  const entries = TOPICS.map((topic) => [topic, topicBreakdown[topic] ?? 0] as const);
  const strongTopics = entries.filter(([, value]) => value >= 70).map(([topic]) => topic);
  const weakTopics = entries.filter(([, value]) => value < 70).map(([topic]) => topic);
  const topicList = weakTopics.length > 0 ? weakTopics.join(", ") : "seluruh topik utama";

  const recommendation =
    weakTopics.length > 0
      ? `Fokuskan penguatan pada ${topicList}. Gunakan modul dan latihan bertahap sebelum melanjutkan evaluasi berikutnya.`
      : "Pertahankan strategi belajar saat ini dan gunakan latihan reflektif untuk menjaga konsistensi pemahaman.";

  const nextActionByType: Record<FeedbackTestType, string> = {
    KAM:
      score >= 70
        ? "Lanjutkan ke Pre Test dan gunakan Modul Ajar sebagai penguatan mandiri."
        : "Pelajari Modul Prasyarat yang direkomendasikan, lalu ulangi Tes KAM.",
    PRE_TEST: "Lanjutkan ke LKM 1. Nilai ini menjadi pembanding untuk Post Test.",
    LKM: "Isi feedback pembelajaran agar tahap berikutnya terbuka.",
    POST_TEST: "Tinjau hasil akhir, topik kuat, topik lemah, dan rekomendasi belajar lanjutan."
  };

  return {
    score,
    achievementStatus,
    strongTopics,
    weakTopics,
    recommendation,
    nextAction: nextActionByType[testType]
  };
}

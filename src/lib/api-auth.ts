import { AccessDeniedError } from "./api";
import { getCurrentUser } from "./auth";

export async function requireStudentApi() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT" || !user.student) {
    throw new AccessDeniedError("Akses mahasiswa diperlukan.");
  }
  return { user, student: user.student };
}

export async function requireTeacherApi() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER" || !user.teacher) {
    throw new AccessDeniedError("Akses guru-dosen diperlukan.");
  }
  return { user, teacher: user.teacher };
}

/**
 * Strip correctAnswer and explanation from a question object.
 * Used to prevent leaking answer keys to students (especially Pre Test).
 */
export function stripAnswerKey<T extends Record<string, unknown>>(question: T): Omit<T, "correctAnswer" | "explanation"> {
  const { correctAnswer, explanation, ...safe } = question;
  return safe as Omit<T, "correctAnswer" | "explanation">;
}

/**
 * Strip answer keys from an array of questions.
 */
export function stripAnswerKeys<T extends Record<string, unknown>>(questions: T[]): Omit<T, "correctAnswer" | "explanation">[] {
  return questions.map(stripAnswerKey);
}

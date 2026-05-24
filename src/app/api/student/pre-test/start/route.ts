import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { assertStudentAccess, getTestForStudentAttemptSecure } from "@/lib/services/student-service";

/**
 * GET /api/student/pre-test/start
 *
 * Returns Pre Test questions for the student WITHOUT correctAnswer or explanation.
 * Security: Prisma select explicitly excludes sensitive fields at the DB level.
 */
export async function GET() {
  try {
    const { student } = await requireStudentApi();
    await assertStudentAccess(student.id, "preTest");
    return jsonOk(await getTestForStudentAttemptSecure("PRE_TEST"));
  } catch (error) {
    return handleApiError(error);
  }
}

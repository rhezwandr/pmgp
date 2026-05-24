import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getPreTestResultSecure } from "@/lib/services/student-service";

/**
 * GET /api/student/pre-test/result
 *
 * Returns Pre Test result for the student WITHOUT correctAnswer or explanation.
 * Only returns: score, status, and confirmation message.
 * Dosen endpoints may return full answer keys separately.
 */
export async function GET() {
  try {
    const { student } = await requireStudentApi();
    const result = await getPreTestResultSecure(student.id);
    if (!result) {
      return jsonOk({ message: "Belum ada hasil Pre Test.", submitted: false });
    }
    return jsonOk({ ...result, submitted: true });
  } catch (error) {
    return handleApiError(error);
  }
}

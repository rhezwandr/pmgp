import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getKamResultWithReview } from "@/lib/services/student-service";

/**
 * GET /api/student/kam/result
 *
 * KAM >= 70: returns full review with correctAnswer + explanation.
 * KAM < 70: returns score + status only, NO answer keys.
 */
export async function GET() {
  try {
    const { student } = await requireStudentApi();
    const result = await getKamResultWithReview(student.id);
    if (!result) return jsonOk(null);

    // If not passed, strip answer keys from response
    if (!result.passed) {
      return jsonOk({
        score: result.score,
        passed: false,
        kkm: result.kkm,
        attemptNumber: result.attemptNumber,
        submittedAt: result.submittedAt,
        review: null // No review for failed students
      });
    }

    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}

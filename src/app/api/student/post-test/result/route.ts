import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getPostTestResultWithReview } from "@/lib/services/student-service";

/**
 * GET /api/student/post-test/result
 *
 * Returns Post Test result WITH full review (correctAnswer + explanation).
 * Post Test is allowed to show answer keys after submission.
 */
export async function GET() {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await getPostTestResultWithReview(student.id));
  } catch (error) {
    return handleApiError(error);
  }
}

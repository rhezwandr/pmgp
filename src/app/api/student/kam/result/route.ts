import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getKamResultWithReview } from "@/lib/services/student-service";

/**
 * GET /api/student/kam/result
 *
 * Returns KAM result WITH full review (correctAnswer + explanation).
 * KAM is allowed to show answer keys after submission (unlike Pre Test).
 */
export async function GET() {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await getKamResultWithReview(student.id));
  } catch (error) {
    return handleApiError(error);
  }
}

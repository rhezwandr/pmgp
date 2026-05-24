import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { submitTest } from "@/lib/services/student-service";

/**
 * POST /api/student/pre-test/submit
 *
 * Submits Pre Test answers. Returns only score and status message.
 * Does NOT return correctAnswer or explanation to the student.
 */
export async function POST(request: Request) {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await submitTest(student.id, "PRE_TEST", await request.json()));
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { assertStudentAccess, getTestForAttempt } from "@/lib/services/student-service";

export async function GET() {
  try {
    const { student } = await requireStudentApi();
    await assertStudentAccess(student.id, "postTest");
    return jsonOk(await getTestForAttempt("POST_TEST"));
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { assertStudentAccess, getTestForAttempt } from "@/lib/services/student-service";

export async function POST() {
  try {
    const { student } = await requireStudentApi();
    await assertStudentAccess(student.id, "retakeKAM");
    return jsonOk(await getTestForAttempt("KAM"));
  } catch (error) {
    return handleApiError(error);
  }
}

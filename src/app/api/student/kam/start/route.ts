import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getTestForAttempt } from "@/lib/services/student-service";

export async function GET() {
  try {
    await requireStudentApi();
    return jsonOk(await getTestForAttempt("KAM"));
  } catch (error) {
    return handleApiError(error);
  }
}

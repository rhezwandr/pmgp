import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getStudentLearningAccess } from "@/lib/learning-access";

export async function GET() {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await getStudentLearningAccess(student.id));
  } catch (error) {
    return handleApiError(error);
  }
}

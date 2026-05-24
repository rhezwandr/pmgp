import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getModulesForStudent } from "@/lib/services/student-service";

export async function GET() {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await getModulesForStudent(student.id));
  } catch (error) {
    return handleApiError(error);
  }
}

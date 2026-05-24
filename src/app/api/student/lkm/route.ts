import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getLkmListForStudent } from "@/lib/services/student-service";

export async function GET() {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await getLkmListForStudent(student.id));
  } catch (error) {
    return handleApiError(error);
  }
}

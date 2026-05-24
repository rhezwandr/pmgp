import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { assertStudentAccess, getStudentDashboardData } from "@/lib/services/student-service";

export async function GET() {
  try {
    const { student } = await requireStudentApi();
    await assertStudentAccess(student.id, "dashboard");
    return jsonOk(await getStudentDashboardData(student.id));
  } catch (error) {
    return handleApiError(error);
  }
}

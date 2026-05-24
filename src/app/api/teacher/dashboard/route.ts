import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { getTeacherDashboardSummary } from "@/lib/services/teacher-service";

export async function GET() {
  try {
    const { teacher } = await requireTeacherApi();
    return jsonOk(await getTeacherDashboardSummary(teacher.id));
  } catch (error) {
    return handleApiError(error);
  }
}

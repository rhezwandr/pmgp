import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { getClassDashboard } from "@/lib/services/teacher-service";

export async function GET(_request: Request, { params }: { params: Promise<{ classId: string }> }) {
  try {
    await requireTeacherApi();
    const { classId } = await params;
    return jsonOk(await getClassDashboard(classId));
  } catch (error) {
    return handleApiError(error);
  }
}

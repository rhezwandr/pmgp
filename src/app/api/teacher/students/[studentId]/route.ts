import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { getStudentDetailForTeacher } from "@/lib/services/teacher-service";

export async function GET(_request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  try {
    await requireTeacherApi();
    const { studentId } = await params;
    return jsonOk(await getStudentDetailForTeacher(studentId));
  } catch (error) {
    return handleApiError(error);
  }
}

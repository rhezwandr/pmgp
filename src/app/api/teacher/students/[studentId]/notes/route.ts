import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { addTeacherNote } from "@/lib/services/teacher-service";

export async function POST(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  try {
    const { teacher } = await requireTeacherApi();
    const { studentId } = await params;
    return jsonOk(await addTeacherNote(teacher.id, studentId, await request.json()));
  } catch (error) {
    return handleApiError(error);
  }
}

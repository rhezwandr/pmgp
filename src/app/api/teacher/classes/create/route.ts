import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { createClassForTeacher } from "@/lib/services/teacher-service";

export async function POST(request: Request) {
  try {
    const { teacher } = await requireTeacherApi();
    return jsonOk(await createClassForTeacher(teacher.id, await request.json()));
  } catch (error) {
    return handleApiError(error);
  }
}

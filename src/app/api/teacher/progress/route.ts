import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { getProgressMahasiswa } from "@/lib/services/teacher-service";

export async function GET(request: Request) {
  try {
    const { teacher } = await requireTeacherApi();
    const url = new URL(request.url);
    return jsonOk(await getProgressMahasiswa(teacher.id, Object.fromEntries(url.searchParams)));
  } catch (error) {
    return handleApiError(error);
  }
}

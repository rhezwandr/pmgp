import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { getLaporanPembelajaran } from "@/lib/services/teacher-service";

export async function GET() {
  try {
    const { teacher } = await requireTeacherApi();
    return jsonOk(await getLaporanPembelajaran(teacher.id));
  } catch (error) {
    return handleApiError(error);
  }
}

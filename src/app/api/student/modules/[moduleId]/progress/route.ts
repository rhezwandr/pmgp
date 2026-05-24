import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { updateModuleStudyProgress } from "@/lib/services/student-service";

export async function POST(request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  try {
    const { student } = await requireStudentApi();
    const { moduleId } = await params;
    return jsonOk(await updateModuleStudyProgress(student.id, moduleId, await request.json()));
  } catch (error) {
    return handleApiError(error);
  }
}

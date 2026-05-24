import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { markModuleCompleted } from "@/lib/services/student-service";

export async function POST(request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  try {
    const { student } = await requireStudentApi();
    const { moduleId } = await params;
    return jsonOk(await markModuleCompleted(student.id, moduleId, await request.json()));
  } catch (error) {
    return handleApiError(error);
  }
}

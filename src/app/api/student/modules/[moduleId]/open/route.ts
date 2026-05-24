import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { startModuleStudy } from "@/lib/services/student-service";

export async function POST(_request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  try {
    const { student } = await requireStudentApi();
    const { moduleId } = await params;
    return jsonOk(await startModuleStudy(student.id, moduleId));
  } catch (error) {
    return handleApiError(error);
  }
}

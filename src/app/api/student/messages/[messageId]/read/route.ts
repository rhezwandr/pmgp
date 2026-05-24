import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { markTeacherMessageRead } from "@/lib/services/student-service";

export async function POST(_request: Request, { params }: { params: Promise<{ messageId: string }> }) {
  try {
    const { student } = await requireStudentApi();
    const { messageId } = await params;
    return jsonOk(await markTeacherMessageRead(student.id, messageId));
  } catch (error) {
    return handleApiError(error);
  }
}

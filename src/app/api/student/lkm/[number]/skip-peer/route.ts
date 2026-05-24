import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { skipPeerAssessment } from "@/lib/services/student-service";

export async function POST(_request: Request, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { student } = await requireStudentApi();
    const { number } = await params;
    return jsonOk(await skipPeerAssessment(student.id, Number(number)));
  } catch (error) {
    return handleApiError(error);
  }
}

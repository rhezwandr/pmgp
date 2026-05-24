import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { submitPeerAssessment } from "@/lib/services/student-service";

export async function POST(request: Request, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { student } = await requireStudentApi();
    const { number } = await params;
    return jsonOk(await submitPeerAssessment(student.id, Number(number), await request.json()));
  } catch (error) {
    return handleApiError(error);
  }
}

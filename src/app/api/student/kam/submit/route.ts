import { handleApiError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { submitTest } from "@/lib/services/student-service";

export async function POST(request: Request) {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await submitTest(student.id, "KAM", await request.json()));
  } catch (error) {
    return handleApiError(error);
  }
}

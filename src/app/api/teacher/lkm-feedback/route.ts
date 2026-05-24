import { handleApiError, jsonOk } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/teacher/lkm-feedback?studentId=X&lkmId=Y
 * Returns existing feedback for a student+LKM combination.
 */
export async function GET(request: Request) {
  try {
    const { teacher } = await requireTeacherApi();
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");
    const lkmId = url.searchParams.get("lkmId");

    if (!studentId || !lkmId) {
      return jsonOk({ feedback: null });
    }

    const feedback = await prisma.teacherLkmFeedback.findUnique({
      where: { studentId_teacherId_lkmId: { studentId, teacherId: teacher.id, lkmId } }
    });

    return jsonOk({ feedback });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/teacher/lkm-feedback
 * Create or update feedback for a student's LKM.
 * Body: { studentId, lkmId, feedbackText }
 */
export async function POST(request: Request) {
  try {
    const { teacher } = await requireTeacherApi();
    const body = await request.json();
    const { studentId, lkmId, feedbackText } = body as {
      studentId: string;
      lkmId: string;
      feedbackText: string;
    };

    if (!studentId || !lkmId || !feedbackText?.trim()) {
      return jsonOk({ error: "studentId, lkmId, dan feedbackText wajib diisi." }, { status: 400 });
    }

    const feedback = await prisma.teacherLkmFeedback.upsert({
      where: { studentId_teacherId_lkmId: { studentId, teacherId: teacher.id, lkmId } },
      update: { feedbackText: feedbackText.trim() },
      create: {
        teacherId: teacher.id,
        studentId,
        lkmId,
        feedbackText: feedbackText.trim()
      }
    });

    return jsonOk({ feedback, message: "Feedback berhasil disimpan." });
  } catch (error) {
    return handleApiError(error);
  }
}

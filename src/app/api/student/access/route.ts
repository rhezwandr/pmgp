import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { prisma } from "@/lib/prisma";
import { checkAndCreateSecurityNotification } from "@/lib/services/notification-service";

export async function GET() {
  try {
    const { student } = await requireStudentApi();
    return jsonOk(await getStudentLearningAccess(student.id));
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/student/access
 * Logs security/anti-cheat events to ActivityLog.
 * After logging, checks threshold and creates internal notification if needed.
 */

const ALLOWED_ACTIVITY_TYPES = new Set([
  // KAM / Pre Test / Post Test
  "SECURITY_TAB_HIDDEN",
  "SECURITY_TAB_BLUR",
  "SECURITY_COPY_ATTEMPT",
  "SECURITY_PASTE_ATTEMPT",
  "SECURITY_CUT_ATTEMPT",
  "SECURITY_RIGHT_CLICK",
  "SECURITY_FULLSCREEN_EXIT",
  "SECURITY_WARNING",
  // LKM
  "LKM_QUESTION_COPY_ATTEMPT",
  "LKM_QUESTION_CUT_ATTEMPT",
  "LKM_QUESTION_RIGHT_CLICK_ATTEMPT",
]);

export async function POST(request: NextRequest) {
  try {
    const { user, student } = await requireStudentApi();

    const body = await request.json();
    const activityType = typeof body.activityType === "string" ? body.activityType.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim().slice(0, 500) : "";

    if (!activityType || !ALLOWED_ACTIVITY_TYPES.has(activityType)) {
      return jsonError("Jenis aktivitas tidak valid.", 400);
    }

    // Save to ActivityLog
    await prisma.activityLog.create({
      data: {
        studentId: student.id,
        activityType,
        description: description || activityType,
      },
    });

    // Check threshold and create notification if needed (non-blocking)
    checkAndCreateSecurityNotification(
      student.id,
      user.id,
      activityType,
      description || activityType
    ).catch(() => {});

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

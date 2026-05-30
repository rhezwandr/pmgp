import { NextRequest } from "next/server";

import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { requireStudentApi } from "@/lib/api-auth";
import { markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/services/notification-service";

/**
 * POST /api/student/notifications/read
 * Mark a single notification or all notifications as read.
 * Body: { notificationId?: string } — if omitted, marks all as read.
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireStudentApi();

    const body = await request.json();
    const notificationId = typeof body.notificationId === "string" ? body.notificationId.trim() : "";

    if (notificationId) {
      const success = await markNotificationAsRead(notificationId, user.id);
      if (!success) {
        return jsonError("Notifikasi tidak ditemukan.", 404);
      }
      return jsonOk({ success: true });
    }

    // Mark all as read
    const count = await markAllNotificationsAsRead(user.id);
    return jsonOk({ success: true, count });
  } catch (error) {
    return handleApiError(error);
  }
}

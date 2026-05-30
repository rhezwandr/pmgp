import { prisma } from "@/lib/prisma";

/**
 * Security Notification Service
 *
 * Creates internal notifications for students who exceed suspicious activity thresholds.
 *
 * Rules:
 * - Threshold: 3 events in same context OR 5 events total today
 * - Deduplication: max 1 notification per student per context per day
 * - Language: neutral, non-accusatory
 * - No secrets, no answers, no passwords stored
 */

const SECURITY_TYPES_EXAM = [
  "SECURITY_TAB_HIDDEN",
  "SECURITY_TAB_BLUR",
  "SECURITY_COPY_ATTEMPT",
  "SECURITY_PASTE_ATTEMPT",
  "SECURITY_CUT_ATTEMPT",
  "SECURITY_RIGHT_CLICK",
  "SECURITY_FULLSCREEN_EXIT",
  "SECURITY_WARNING",
];

const SECURITY_TYPES_LKM = [
  "LKM_QUESTION_COPY_ATTEMPT",
  "LKM_QUESTION_CUT_ATTEMPT",
  "LKM_QUESTION_RIGHT_CLICK_ATTEMPT",
];

const ALL_SECURITY_TYPES = [...SECURITY_TYPES_EXAM, ...SECURITY_TYPES_LKM];

/** Threshold: events in same context to trigger notification */
const CONTEXT_THRESHOLD = 3;
/** Threshold: total events today to trigger notification */
const DAILY_THRESHOLD = 5;

function getContextFromActivityType(activityType: string, description: string): string {
  if (activityType.startsWith("LKM_")) {
    // Extract LKM number from description like "Mahasiswa mencoba menyalin pertanyaan LKM 2."
    const match = description.match(/LKM\s*(\d+)/i);
    return match ? `LKM_${match[1]}` : "LKM";
  }
  // For exam events, extract context from description like "KAM: TAB_HIDDEN"
  const parts = description.split(":");
  if (parts.length >= 1) {
    const ctx = parts[0].trim().toUpperCase();
    if (["KAM", "PRE_TEST", "POST_TEST", "PRE TEST", "POST TEST"].includes(ctx)) {
      return ctx.replace(" ", "_");
    }
  }
  return "EXAM";
}

function getNotificationMessage(context: string): { title: string; message: string } {
  if (context.startsWith("LKM")) {
    return {
      title: "Peringatan Aktivitas Pengerjaan LKM",
      message:
        "Sistem mendeteksi percobaan menyalin pertanyaan LKM. Pertanyaan tidak diperbolehkan untuk disalin. Silakan kerjakan jawaban pada kolom yang tersedia.",
    };
  }
  return {
    title: "Peringatan Aktivitas Pengerjaan",
    message:
      "Sistem mendeteksi beberapa aktivitas keluar halaman atau percobaan menyalin selama pengerjaan. Mohon tetap berada pada halaman pengerjaan dan mengikuti instruksi dosen.",
  };
}

/**
 * Check if a notification should be created after a security event is logged.
 * Called from the POST /api/student/access handler.
 */
export async function checkAndCreateSecurityNotification(
  studentId: string,
  userId: string,
  activityType: string,
  description: string
): Promise<void> {
  try {
    const context = getContextFromActivityType(activityType, description);

    // Get start of today (UTC)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Check deduplication: already sent notification for this context today?
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: "WARNING",
        context,
        createdAt: { gte: todayStart },
      },
    });

    if (existingNotification) {
      // Already notified today for this context, skip
      return;
    }

    // Count events in same context today
    const contextTypes = context.startsWith("LKM") ? SECURITY_TYPES_LKM : SECURITY_TYPES_EXAM;
    const contextCount = await prisma.activityLog.count({
      where: {
        studentId,
        activityType: { in: contextTypes },
        createdAt: { gte: todayStart },
        // For LKM, filter by description containing the LKM number
        ...(context.startsWith("LKM_") && context !== "LKM"
          ? { description: { contains: context.replace("LKM_", "LKM ") } }
          : {}),
      },
    });

    // Count total security events today
    const totalCount = await prisma.activityLog.count({
      where: {
        studentId,
        activityType: { in: ALL_SECURITY_TYPES },
        createdAt: { gte: todayStart },
      },
    });

    // Check thresholds
    const shouldNotify = contextCount >= CONTEXT_THRESHOLD || totalCount >= DAILY_THRESHOLD;

    if (!shouldNotify) {
      return;
    }

    // Create notification
    const { title, message } = getNotificationMessage(context);

    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: "WARNING",
        context,
      },
    });
  } catch (error) {
    // Non-critical: log but don't break the main flow
    if (process.env.NODE_ENV !== "production") {
      console.error("[Notification Service]", error);
    }
  }
}

/**
 * Get unread notification count for a user.
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

/**
 * Get notifications for a user (most recent first, limited).
 */
export async function getNotificationsForUser(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Mark a notification as read.
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
  const result = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
  return result.count > 0;
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  return result.count;
}

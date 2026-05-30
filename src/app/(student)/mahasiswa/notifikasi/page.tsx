import { MessageReadButton } from "@/components/forms/message-read-button";
import { MarkAllReadButton, NotificationReadButton } from "@/components/forms/notification-read-button";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireStudentProfile } from "@/lib/route-guards";
import { getTeacherMessagesForStudent } from "@/lib/services/student-service";
import { getNotificationsForUser } from "@/lib/services/notification-service";

export default async function NotifikasiMahasiswaPage() {
  const { user, student } = await requireStudentProfile();

  // Get all notifications: system notifications + messages + LKM feedback + teacher notes
  const [systemNotifications, messages, lkmFeedbacks, teacherNotes] = await Promise.all([
    getNotificationsForUser(user.id),
    getTeacherMessagesForStudent(student.id),
    prisma.teacherLkmFeedback.findMany({
      where: { studentId: student.id },
      include: { teacher: { include: { user: { select: { name: true } } } }, lkm: { select: { title: true, number: true } } },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.teacherNote.findMany({
      where: { studentId: student.id },
      include: { teacher: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const unreadMessages = messages.filter((m) => !m.readAt).length;
  const unreadNotifications = systemNotifications.filter((n) => !n.isRead).length;
  const totalUnread = unreadMessages + unreadNotifications;
  const totalNotifications = messages.length + lkmFeedbacks.length + teacherNotes.length + systemNotifications.length;

  return (
    <>
      <PageHeader
        title="Notifikasi"
        description="Pesan, peringatan sistem, feedback LKM, dan catatan dari dosen."
        action={<Badge tone={totalUnread > 0 ? "warning" : "success"}>{totalUnread} belum dibaca</Badge>}
      />

      {totalNotifications === 0 ? (
        <EmptyState title="Belum ada notifikasi" description="Pesan dan feedback dari dosen akan tampil di sini." />
      ) : (
        <div className="grid gap-4">
          {/* System Security Notifications */}
          {systemNotifications.length > 0 && (
            <Card
              title="Peringatan Sistem"
              description="Notifikasi otomatis dari sistem terkait aktivitas pengerjaan."
              action={<MarkAllReadButton hasUnread={unreadNotifications > 0} />}
            >
              <div className="space-y-3">
                {systemNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-2xl border p-3 text-sm ${
                      notif.isRead
                        ? "border-stone-200 bg-stone-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <p className={`font-semibold ${notif.isRead ? "text-stone-700" : "text-red-800"}`}>
                        {notif.title}
                      </p>
                      <Badge tone={notif.isRead ? "neutral" : "error"}>
                        {notif.isRead ? "Dibaca" : "Baru"}
                      </Badge>
                      {notif.context && (
                        <Badge tone="neutral">{notif.context.replace("_", " ")}</Badge>
                      )}
                    </div>
                    <p className={`leading-relaxed ${notif.isRead ? "text-stone-600" : "text-red-700"}`}>
                      {notif.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {notif.createdAt.toLocaleString("id-ID")}
                      </span>
                      <NotificationReadButton notificationId={notif.id} disabled={notif.isRead} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* LKM Feedback from teacher */}
          {lkmFeedbacks.length > 0 && (
            <Card title="Feedback Dosen per LKM" description="Feedback kualitatif dari dosen untuk setiap LKM yang sudah Anda kerjakan.">
              <div className="space-y-3">
                {lkmFeedbacks.map((fb) => (
                  <div key={fb.id} className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone="success">{fb.lkm.title}</Badge>
                      <span className="text-xs text-muted">oleh {fb.teacher.user.name} | {fb.updatedAt.toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-green-800">{fb.feedbackText}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Teacher Notes */}
          {teacherNotes.length > 0 && (
            <Card title="Catatan Dosen" description="Catatan dan arahan dari dosen untuk Anda.">
              <div className="space-y-3">
                {teacherNotes.map((note) => (
                  <div key={note.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm">
                    <p className="mb-1 text-xs text-muted">{note.teacher.user.name} | {note.createdAt.toLocaleString("id-ID")}</p>
                    <p className="text-amber-900">{note.noteText}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Direct Messages */}
          {messages.length > 0 && (
            <Card title="Pesan dari Dosen">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-border bg-white p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-stone-950">{message.title}</p>
                      <Badge tone={message.readAt ? "neutral" : "warning"}>{message.readAt ? "Dibaca" : "Baru"}</Badge>
                    </div>
                    <p className="text-xs text-muted">{message.teacher.user.name} | {message.createdAt.toLocaleString("id-ID")}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{message.content}</p>
                    <div className="mt-3">
                      <MessageReadButton messageId={message.id} disabled={Boolean(message.readAt)} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

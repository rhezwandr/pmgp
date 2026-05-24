import { MessageReadButton } from "@/components/forms/message-read-button";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireStudentProfile } from "@/lib/route-guards";
import { getTeacherMessagesForStudent } from "@/lib/services/student-service";

export default async function NotifikasiMahasiswaPage() {
  const { student } = await requireStudentProfile();

  // Get all notifications: messages + LKM feedback + teacher notes
  const [messages, lkmFeedbacks, teacherNotes] = await Promise.all([
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
  const totalNotifications = messages.length + lkmFeedbacks.length + teacherNotes.length;

  return (
    <>
      <PageHeader
        title="Notifikasi"
        description="Pesan, feedback LKM, dan catatan dari dosen."
        action={<Badge tone={unreadMessages > 0 ? "warning" : "success"}>{unreadMessages} pesan baru</Badge>}
      />

      {totalNotifications === 0 ? (
        <EmptyState title="Belum ada notifikasi" description="Pesan dan feedback dari dosen akan tampil di sini." />
      ) : (
        <div className="grid gap-4">
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

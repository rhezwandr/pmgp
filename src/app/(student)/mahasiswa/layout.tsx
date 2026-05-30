import { StudentShell } from "@/components/layout/app-shell";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { requireStudentProfile } from "@/lib/route-guards";
import { getUnreadTeacherMessageCount } from "@/lib/services/student-service";
import { getUnreadNotificationCount } from "@/lib/services/notification-service";

export default async function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const { user, student } = await requireStudentProfile();
  const [access, unreadMessageCount, unreadNotifCount] = await Promise.all([
    getStudentLearningAccess(student.id),
    getUnreadTeacherMessageCount(student.id),
    getUnreadNotificationCount(user.id)
  ]);
  return (
    <StudentShell userName={user.name} access={access} unreadMessageCount={unreadMessageCount + unreadNotifCount}>
      {children}
    </StudentShell>
  );
}

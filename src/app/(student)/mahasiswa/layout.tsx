import { StudentShell } from "@/components/layout/app-shell";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { requireStudentProfile } from "@/lib/route-guards";
import { getUnreadTeacherMessageCount } from "@/lib/services/student-service";

export default async function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const { user, student } = await requireStudentProfile();
  const [access, unreadMessageCount] = await Promise.all([
    getStudentLearningAccess(student.id),
    getUnreadTeacherMessageCount(student.id)
  ]);
  return (
    <StudentShell userName={user.name} access={access} unreadMessageCount={unreadMessageCount}>
      {children}
    </StudentShell>
  );
}

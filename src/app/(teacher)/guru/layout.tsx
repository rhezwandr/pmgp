import { TeacherShell } from "@/components/layout/app-shell";
import { requireTeacherProfile } from "@/lib/route-guards";

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireTeacherProfile();
  return <TeacherShell userName={user.name}>{children}</TeacherShell>;
}

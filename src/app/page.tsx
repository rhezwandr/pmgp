import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { redirectAfterStudentAuth } from "@/lib/route-guards";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "TEACHER") redirect("/guru/dashboard");
  if (user.student) {
    const access = await getStudentLearningAccess(user.student.id);
    redirect(redirectAfterStudentAuth(access.activeStage));
  }
  redirect("/login");
}

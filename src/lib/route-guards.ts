import { redirect } from "next/navigation";

import { getCurrentUser } from "./auth";
import { canAccessKey, getStudentLearningAccess, type StudentAccessKey } from "./learning-access";

export async function requireStudentProfile() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "STUDENT" || !user.student) redirect("/guru/dashboard");
  return { user, student: user.student };
}

export async function requireTeacherProfile() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "TEACHER" || !user.teacher) redirect("/mahasiswa/tes-kam");
  return { user, teacher: user.teacher };
}

export async function guardStudentAccess(key: StudentAccessKey) {
  const { user, student } = await requireStudentProfile();
  const access = await getStudentLearningAccess(student.id);
  if (!canAccessKey(access, key)) {
    if (key === "dashboard") redirect("/mahasiswa/tes-kam");
    if (key === "preTest") redirect("/mahasiswa/tes-kam/result");
    if (key === "retakeKAM") redirect("/mahasiswa/modul");
    if (key === "lkm1" || key === "lkm2" || key === "lkm3" || key === "lkm4" || key === "lkm5" || key === "lkm6") redirect("/mahasiswa/lkm");
    if (key === "postTest") redirect("/mahasiswa/lkm");
  }
  return { user, student, access };
}

export function redirectAfterStudentAuth(accessActiveStage: string) {
  if (accessActiveStage === "TES_KAM") return "/mahasiswa/tes-kam";
  if (accessActiveStage === "MODUL_REMEDIAL") return "/mahasiswa/modul";
  return "/mahasiswa/dashboard";
}

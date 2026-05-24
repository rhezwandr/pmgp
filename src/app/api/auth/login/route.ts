import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { attachAuthCookies } from "@/lib/auth";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { prisma } from "@/lib/prisma";
import { redirectAfterStudentAuth } from "@/lib/route-guards";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: input.email }, include: { student: true, teacher: true } });
    if (!user) return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirectTo:
        user.role === "TEACHER"
          ? "/guru/dashboard"
          : redirectAfterStudentAuth((await getStudentLearningAccess(user.student!.id)).activeStage)
    });
    attachAuthCookies(response, { userId: user.id, role: user.role });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

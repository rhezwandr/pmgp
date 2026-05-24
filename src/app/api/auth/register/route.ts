import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api";
import { attachAuthCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthRegistrationError, registerUser } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  try {
    const result = await registerUser(await request.json(), {
      db: prisma,
      hashPassword: (password) => bcrypt.hash(password, 12)
    });

    const response = NextResponse.json({
      user: { id: result.user.id, name: result.user.name, email: result.user.email, role: result.user.role },
      redirectTo: result.redirectTo
    });
    attachAuthCookies(response, { userId: result.user.id, role: result.user.role });
    return response;
  } catch (error) {
    if (error instanceof AuthRegistrationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return handleApiError(error);
  }
}

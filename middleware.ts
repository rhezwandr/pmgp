import { NextResponse, type NextRequest } from "next/server";

import { ROLE_COOKIE, SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  // Verify token signature (not just existence)
  const payload = verifySessionToken(sessionToken);

  if (pathname.startsWith("/mahasiswa")) {
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));
    if (payload.role !== "STUDENT") return NextResponse.redirect(new URL("/guru/dashboard", request.url));
  }

  if (pathname.startsWith("/guru")) {
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));
    if (payload.role !== "TEACHER") return NextResponse.redirect(new URL("/mahasiswa/tes-kam", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mahasiswa/:path*", "/guru/:path*"]
};

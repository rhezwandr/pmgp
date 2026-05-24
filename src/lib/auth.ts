import crypto from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "./prisma";

export const SESSION_COOKIE = "kam_lkm_session";
export const ROLE_COOKIE = "kam_lkm_role";

export type SessionPayload = {
  userId: string;
  role: "STUDENT" | "TEACHER";
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is required in production.");
    }
    return "development-secret-change-me-not-for-production";
  }
  return secret;
}

function toBase64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const body = toBase64Url(JSON.stringify({ ...payload, exp }));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return null;

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function attachAuthCookies(response: NextResponse, payload: Omit<SessionPayload, "exp">) {
  const token = createSessionToken(payload);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  response.cookies.set(ROLE_COOKIE, payload.role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(ROLE_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser() {
  const payload = await getSessionPayload();
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      student: true,
      teacher: true
      // passwordHash: EXCLUDED
    }
  });
}

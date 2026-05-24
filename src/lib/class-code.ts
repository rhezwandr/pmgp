import crypto from "node:crypto";

export function normalizeClassCode(value: string) {
  return value.trim().toUpperCase();
}

export function looksLikeClassCode(value: string) {
  return /^KLS-[A-Z0-9]{6,10}$/.test(normalizeClassCode(value));
}

export function generateClassCode() {
  return `KLS-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

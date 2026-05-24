/**
 * k6 Load Test — Staging 300 Mahasiswa
 *
 * Install k6: https://k6.io/docs/get-started/installation/
 *
 * Jalankan:
 *   STAGING_BASE_URL=http://localhost:3000 k6 run scripts/load-test/staging-300.js
 *
 * GUARD: Menolak jalan jika URL mengandung kata "production" atau domain production.
 */

import http from "k6/http";
import { check, sleep, group } from "k6";
import { SharedArray } from "k6/data";

// ─── Configuration ──────────────────────────────────────────────────────────────

const BASE_URL = __ENV.STAGING_BASE_URL || "http://localhost:3000";
const PASSWORD = __ENV.LOAD_TEST_PASSWORD || "Test123456!";

// Safety guard
if (BASE_URL.includes("production") || BASE_URL.includes("vercel.app")) {
  if (__ENV.ALLOW_PRODUCTION_LOAD_TEST !== "true") {
    throw new Error("❌ DITOLAK: Load test tidak boleh ke production tanpa ALLOW_PRODUCTION_LOAD_TEST=true");
  }
}

// ─── Scenarios ──────────────────────────────────────────────────────────────────

export const options = {
  scenarios: {
    // A. Smoke test: 10 users
    smoke: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      startTime: "0s",
      tags: { scenario: "smoke" },
    },
    // B. Moderate: 50 users
    moderate: {
      executor: "constant-vus",
      vus: 50,
      duration: "60s",
      startTime: "35s",
      tags: { scenario: "moderate" },
    },
    // C. Heavy: 100 concurrent
    heavy: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 100 },
        { duration: "60s", target: 100 },
        { duration: "30s", target: 0 },
      ],
      startTime: "100s",
      tags: { scenario: "heavy" },
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<5000"],  // 95% requests under 5s
    http_req_failed: ["rate<0.01"],      // Less than 1% errors
  },
};

// ─── Test Logic ─────────────────────────────────────────────────────────────────

export default function () {
  const userNum = String((__VU % 300) + 1).padStart(3, "0");
  const email = `mahasiswa${userNum}@example.test`;

  group("Login", () => {
    const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: email,
      password: PASSWORD,
    }), { headers: { "Content-Type": "application/json" } });

    check(loginRes, {
      "login status 200": (r) => r.status === 200,
      "login has cookie": (r) => r.headers["Set-Cookie"] !== undefined,
    });

    if (loginRes.status !== 200) {
      sleep(1);
      return;
    }

    // Extract cookies for subsequent requests
    const jar = http.cookieJar();

    group("Dashboard", () => {
      const dashRes = http.get(`${BASE_URL}/api/student/access`);
      check(dashRes, {
        "access status 200": (r) => r.status === 200,
      });
    });

    group("KAM Start", () => {
      const kamRes = http.get(`${BASE_URL}/api/student/kam/start`);
      check(kamRes, {
        "kam status 200 or 403": (r) => r.status === 200 || r.status === 403,
        "kam no correctAnswer leak": (r) => !r.body.includes('"correctAnswer"'),
      });
    });

    group("Pre Test Start", () => {
      const preRes = http.get(`${BASE_URL}/api/student/pre-test/start`);
      check(preRes, {
        "pretest status 200 or 403": (r) => r.status === 200 || r.status === 403,
        "pretest no correctAnswer": (r) => !r.body.includes('"correctAnswer"'),
        "pretest no explanation": (r) => !r.body.includes('"explanation"'),
      });
    });

    group("LKM List", () => {
      const lkmRes = http.get(`${BASE_URL}/api/student/lkm`);
      check(lkmRes, {
        "lkm status 200 or 403": (r) => r.status === 200 || r.status === 403,
      });
    });
  });

  sleep(Math.random() * 2 + 1); // 1-3 second think time
}

/**
 * Generate 300 akun dummy mahasiswa untuk staging/load test.
 * Output: data/test-students-300.csv
 *
 * Jalankan: npm run generate:test-students
 */

import fs from "fs";
import path from "path";

const CLASS_CODES = [
  { code: "KELAS-A", range: [1, 50] },
  { code: "KELAS-B", range: [51, 100] },
  { code: "KELAS-C", range: [101, 150] },
  { code: "KELAS-D", range: [151, 200] },
  { code: "KELAS-E", range: [201, 250] },
  { code: "KELAS-F", range: [251, 300] },
] as const;

const PASSWORD = "Test123456!";
const TOTAL = 300;

function pad(n: number, len: number): string {
  return String(n).padStart(len, "0");
}

function main() {
  const outputDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, "test-students-300.csv");
  const lines: string[] = ["name,email,nim,password,classCode"];

  for (let i = 1; i <= TOTAL; i++) {
    const classEntry = CLASS_CODES.find((c) => i >= c.range[0] && i <= c.range[1]);
    const classCode = classEntry?.code ?? "KELAS-A";
    lines.push(`Mahasiswa Test ${pad(i, 3)},mahasiswa${pad(i, 3)}@example.test,TEST${pad(i, 4)},${PASSWORD},${classCode}`);
  }

  fs.writeFileSync(outputPath, lines.join("\n") + "\n", "utf-8");

  console.log("═══════════════════════════════════════════════");
  console.log("  Generate Test Students CSV");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Output: ${outputPath}`);
  console.log(`  Total : ${TOTAL} mahasiswa`);
  console.log(`  Kelas : ${CLASS_CODES.map((c) => c.code).join(", ")}`);
  console.log(`  Email : mahasiswa001@example.test — mahasiswa300@example.test`);
  console.log(`  NIM   : TEST0001 — TEST0300`);
  console.log(`  Pass  : ${PASSWORD}`);
  console.log("═══════════════════════════════════════════════");
}

main();

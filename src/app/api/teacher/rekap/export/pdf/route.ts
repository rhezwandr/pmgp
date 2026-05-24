import fs from "node:fs";
import path from "node:path";

import { jsPDF } from "jspdf";

import { requireTeacherApi } from "@/lib/api-auth";
import { getRekapNilai, groupRowsByClass } from "@/lib/services/teacher-service";

export async function GET(request: Request) {
  const { teacher, user } = await requireTeacherApi();
  const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
  const rows = await getRekapNilai(teacher.id, searchParams);
  const grouped = groupRowsByClass(rows);
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoPath = path.join(process.cwd(), "public", "logo-upi.png");

  let y = 16;
  if (fs.existsSync(logoPath)) {
    const logo = fs.readFileSync(logoPath).toString("base64");
    doc.addImage(`data:image/png;base64,${logo}`, "PNG", 14, 8, 42, 15);
  }
  doc.setFontSize(15);
  doc.text("Rekap Nilai KAM-LKM", pageWidth / 2, y, { align: "center" });
  doc.setFontSize(9);
  doc.text(`Universitas Pendidikan Indonesia | Dosen: ${user.name} | Export: ${new Date().toLocaleDateString("id-ID")}`, pageWidth / 2, y + 7, { align: "center" });
  y = 34;

  const headers = ["Nama", "NIM", "KAM", "Pre", "LKM", "Post", "Rata2", "Status"];
  const widths = [50, 28, 20, 20, 22, 20, 22, 34];

  for (const group of grouped) {
    if (y > 175) {
      doc.addPage();
      y = 18;
    }
    doc.setFontSize(11);
    doc.text(`Kelas: ${group.className}`, 14, y);
    y += 7;
    let x = 14;
    doc.setFontSize(8);
    doc.setFillColor(254, 242, 242);
    doc.rect(14, y - 5, widths.reduce((sum, width) => sum + width, 0), 7, "F");
    headers.forEach((header, index) => {
      doc.text(header, x + 1, y);
      x += widths[index];
    });
    y += 5;
    for (const row of group.rows) {
      if (y > 190) {
        doc.addPage();
        y = 18;
      }
      x = 14;
      const lkmDone = [row.lkm1, row.lkm2, row.lkm3, row.lkm4, row.lkm5, row.lkm6].filter(Boolean).length;
      const values = [row.name, row.nim, row.kam ?? "-", row.preTest ?? "-", `${lkmDone}/6`, row.postTest ?? "-", row.averageScore, row.finalStatus];
      values.forEach((value, index) => {
        doc.text(String(value).slice(0, 24), x + 1, y);
        x += widths[index];
      });
      y += 6;
    }
    y += 6;
  }

  if (rows.length === 0) {
    doc.text("Tidak ada data rekap nilai untuk filter yang dipilih.", 14, y);
  }
  const buffer = Buffer.from(doc.output("arraybuffer"));
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=rekap-nilai.pdf"
    }
  });
}

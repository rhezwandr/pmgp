import * as XLSX from "xlsx";

import { requireTeacherApi } from "@/lib/api-auth";
import { getRekapNilai, groupRowsByClass } from "@/lib/services/teacher-service";

export async function GET(request: Request) {
  const { teacher } = await requireTeacherApi();
  const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
  const rows = await getRekapNilai(teacher.id, searchParams);
  const grouped = groupRowsByClass(rows);
  const workbook = XLSX.utils.book_new();

  for (const group of grouped) {
    const worksheet = XLSX.utils.json_to_sheet(
      group.rows.map((row) => ({
      Nama: row.name,
      NIM: row.nim,
      Kelas: row.className,
      "Skor KAM": row.kam ?? "",
      "Skor Pre Test": row.preTest ?? "",
      "LKM Selesai": `${[row.lkm1, row.lkm2, row.lkm3, row.lkm4, row.lkm5, row.lkm6].filter(Boolean).length}/6`,
      "Skor Post Test": row.postTest ?? "",
      "Rata-rata": row.averageScore,
      Status: row.finalStatus
      }))
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, group.className.slice(0, 31) || "Rekap Nilai");
  }
  if (grouped.length === 0) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{ Pesan: "Tidak ada data rekap nilai untuk filter yang dipilih." }]), "Rekap Nilai");
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=rekap-nilai.xlsx"
    }
  });
}

import * as XLSX from "xlsx";

import { AccessDeniedError } from "@/lib/api";
import { requireTeacherApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { getClassDashboard } from "@/lib/services/teacher-service";

export async function GET(_request: Request, { params }: { params: Promise<{ classId: string }> }) {
  const { teacher, user } = await requireTeacherApi();
  const { classId } = await params;

  // Validate class belongs to this teacher
  const classItem = await prisma.class.findUnique({ where: { id: classId } });
  if (!classItem) throw new AccessDeniedError("Kelas tidak ditemukan.");
  if (classItem.teacherId !== teacher.id) throw new AccessDeniedError("Anda tidak memiliki akses ke kelas ini.");

  const data = await getClassDashboard(classId);
  const exportDate = new Date().toLocaleDateString("id-ID");

  // Sheet 1: Ringkasan
  const summaryData = [
    { Informasi: "Nama Kelas", Nilai: data.classItem.name },
    { Informasi: "Kode Kelas", Nilai: data.classItem.code },
    { Informasi: "Dosen", Nilai: user.name },
    { Informasi: "Semester", Nilai: `${data.classItem.semester} ${data.classItem.academicYear}` },
    { Informasi: "Tanggal Export", Nilai: exportDate },
    { Informasi: "Total Mahasiswa", Nilai: String(data.students.length) },
    { Informasi: "Rata-rata Skor", Nilai: String(data.averageScore) },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);

  // Sheet 2: Rekap Mahasiswa
  const rekapData = data.students.map((student, idx) => ({
    No: idx + 1,
    Nama: student.name,
    NIM: student.nim,
    "Skor KAM": student.kam ?? "-",
    "Status KAM": student.kamStatus,
    "Skor Pre Test": student.preTest ?? "-",
    "LKM 1": student.lkm1 ? "✅" : "-",
    "LKM 2": student.lkm2 ? "✅" : "-",
    "LKM 3": student.lkm3 ? "✅" : "-",
    "LKM 4": student.lkm4 ? "✅" : "-",
    "LKM 5": student.lkm5 ? "✅" : "-",
    "LKM 6": student.lkm6 ? "✅" : "-",
    "LKM Selesai": `${student.lkmCompleted}/6`,
    "Skor Post Test": student.postTest ?? "-",
    "Progress": `${student.progress}%`,
    "Status": student.status,
  }));
  const rekapSheet = XLSX.utils.json_to_sheet(rekapData);

  // Build workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");
  XLSX.utils.book_append_sheet(workbook, rekapSheet, "Rekap Mahasiswa");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const filename = `rekap-kelas-${data.classItem.code}-${exportDate.replace(/\//g, "-")}.xlsx`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}

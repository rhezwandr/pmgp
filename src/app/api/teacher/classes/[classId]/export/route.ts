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

  const workbook = XLSX.utils.book_new();

  // Sheet 1: Ringkasan Kelas
  const summaryData = [
    { Informasi: "Nama Kelas", Nilai: data.classItem.name },
    { Informasi: "Kode Kelas", Nilai: data.classItem.code },
    { Informasi: "Dosen", Nilai: user.name },
    { Informasi: "Semester", Nilai: `${data.classItem.semester} ${data.classItem.academicYear}` },
    { Informasi: "Tanggal Export", Nilai: exportDate },
    { Informasi: "Total Mahasiswa", Nilai: String(data.students.length) },
    { Informasi: "Rata-rata Skor Kelas", Nilai: String(data.averageScore) },
    { Informasi: "Rata-rata KAM", Nilai: String(data.chart[0]?.score ?? 0) },
    { Informasi: "Rata-rata Pre Test", Nilai: String(data.chart[1]?.score ?? 0) },
    { Informasi: "Rata-rata Post Test", Nilai: String(data.chart[2]?.score ?? 0) },
    { Informasi: "Perlu Bantuan", Nilai: String(data.needingAssistance.length) },
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Ringkasan");

  // Sheet 2: Persentase Penyelesaian
  const completionData = Object.entries(data.completion).map(([tahap, persen]) => ({
    Tahap: tahap,
    "Persentase Selesai (%)": persen,
  }));
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(completionData), "Penyelesaian");

  // Sheet 3: Data Mentah Per Mahasiswa
  const rekapData = data.students.map((student, idx) => ({
    No: idx + 1,
    Nama: student.name,
    NIM: student.nim,
    "Skor KAM": student.kam ?? "",
    "Status KAM": student.kamStatus,
    "Skor Pre Test": student.preTest ?? "",
    "LKM 1": student.lkm1 ? "Selesai" : "",
    "LKM 2": student.lkm2 ? "Selesai" : "",
    "LKM 3": student.lkm3 ? "Selesai" : "",
    "LKM 4": student.lkm4 ? "Selesai" : "",
    "LKM 5": student.lkm5 ? "Selesai" : "",
    "LKM 6": student.lkm6 ? "Selesai" : "",
    "LKM Selesai": student.lkmCompleted,
    "Skor Post Test": student.postTest ?? "",
    "Progress (%)": student.progress,
    Status: student.status,
    "Perlu Bantuan": student.needsAttention ? "Ya" : "Tidak",
  }));
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rekapData), "Data Mahasiswa");

  // Sheet 4: LKM Status Detail
  const lkmStatusData = data.lkmStatus.map((l) => ({
    LKM: l.name,
    "Sudah Selesai": l.completed,
    "Total Mahasiswa": l.total,
    "Persentase (%)": l.total > 0 ? Math.round((l.completed / l.total) * 100) : 0,
  }));
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(lkmStatusData), "Status LKM");

  // Sheet 5: Mahasiswa Perlu Bantuan
  if (data.needingAssistance.length > 0) {
    const assistData = data.needingAssistance.map((s) => ({
      Nama: s.name,
      NIM: s.nim,
      KAM: s.kam ?? "-",
      "Pre Test": s.preTest ?? "-",
      "Post Test": s.postTest ?? "-",
      "LKM Selesai": `${s.lkmCompleted}/6`,
      Status: s.status,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(assistData), "Perlu Bantuan");
  }

  // Sheet 6: Topik Lemah (per kelas)
  const classAnswers = await prisma.studentAnswer.findMany({
    where: { student: { classId } },
    include: { question: { select: { topic: true } } },
  });
  if (classAnswers.length > 0) {
    const topicStats = new Map<string, { total: number; wrong: number }>();
    for (const ans of classAnswers) {
      const stats = topicStats.get(ans.question.topic) ?? { total: 0, wrong: 0 };
      stats.total++;
      if (!ans.isCorrect) stats.wrong++;
      topicStats.set(ans.question.topic, stats);
    }
    const topicData = Array.from(topicStats.entries())
      .map(([topic, stats]) => ({
        Topik: topic,
        "Jumlah Jawaban": stats.total,
        "Jumlah Salah": stats.wrong,
        "Persentase Salah (%)": Math.round((stats.wrong / stats.total) * 100),
      }))
      .sort((a, b) => b["Persentase Salah (%)"] - a["Persentase Salah (%)"]);
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(topicData), "Topik Lemah");
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const filename = `laporan-kelas-${data.classItem.code}-${exportDate.replace(/\//g, "-")}.xlsx`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

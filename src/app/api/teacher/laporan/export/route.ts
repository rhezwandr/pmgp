import * as XLSX from "xlsx";

import { requireTeacherApi } from "@/lib/api-auth";
import { getLaporanPembelajaran, getStudentOverviews } from "@/lib/services/teacher-service";

export async function GET() {
  const { teacher } = await requireTeacherApi();
  const report = await getLaporanPembelajaran(teacher.id);
  const students = await getStudentOverviews(teacher.id);
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Ringkasan Umum
  const summaryData = [
    { Indikator: "Persentase Lulus KAM", Nilai: `${report.passedKamPercentage}%` },
    { Indikator: "Rata-rata Pre Test", Nilai: report.prePostChart[0]?.score ?? 0 },
    { Indikator: "Rata-rata Post Test", Nilai: report.prePostChart[1]?.score ?? 0 },
    { Indikator: "Jumlah Mahasiswa", Nilai: students.length },
    { Indikator: "Rekomendasi", Nilai: report.recommendations },
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Ringkasan");

  // Sheet 2: Rata-rata per Kelas
  const classData = report.classChart.map((c) => ({
    Kelas: c.name,
    "Rata-rata Skor": c.score,
  }));
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(classData), "Rata-rata Kelas");

  // Sheet 3: Penyelesaian LKM
  const lkmData = report.lkmCompletion.map((l) => ({
    LKM: l.name,
    "Persentase Selesai": `${l.value}%`,
  }));
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(lkmData), "Penyelesaian LKM");

  // Sheet 4: Topik Lemah
  if (report.mostCommonWeakTopics.length > 0) {
    const topicData = report.mostCommonWeakTopics.map((t) => ({
      Topik: t.topic,
      "Jumlah Salah": t.count,
      "Total Jawaban": t.total,
      "Persentase Salah": `${t.errorRate}%`,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(topicData), "Topik Lemah");
  }

  // Sheet 5: Feedback Pembelajaran
  if (report.feedbackSummary && report.feedbackSummary.totalResponden > 0) {
    const fbData = [
      { Indikator: "Jumlah Responden", Nilai: report.feedbackSummary.totalResponden },
      { Indikator: "Rating Rata-rata", Nilai: `${report.feedbackSummary.averageRating}/5` },
      ...report.feedbackSummary.distribution.map((d) => ({
        Indikator: `Rating ${d.rating}`,
        Nilai: `${d.count} mahasiswa (${d.percentage}%)`,
      })),
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(fbData), "Feedback Rating");

    if (report.feedbackSummary.themes.length > 0) {
      const themeData = report.feedbackSummary.themes.map((t) => ({
        Tema: t.theme,
        "Jumlah Sebutan": t.count,
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(themeData), "Tema Feedback");
    }
  }

  // Sheet 6: Students Needing Assistance
  if (report.studentsNeedingAssistance.length > 0) {
    const assistData = report.studentsNeedingAssistance.map((s) => ({
      Nama: s.name,
      Kelas: s.className,
      KAM: s.kam ?? "-",
      "Pre Test": s.preTest ?? "-",
      "Post Test": s.postTest ?? "-",
      "LKM Selesai": `${s.lkmCompleted}/6`,
      Status: s.status,
      Alasan: s.reason,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(assistData), "Perlu Bantuan");
  }

  // Sheets Per Kelas: Data Lengkap Mahasiswa dipisah per kelas
  const classesSorted = [...new Set(students.map((s) => s.className))].sort();
  for (const className of classesSorted) {
    const classStudents = students.filter((s) => s.className === className);
    const sheetData = classStudents.map((s, idx) => ({
      No: idx + 1,
      Nama: s.name,
      NIM: s.nim,
      "Skor KAM": s.kam ?? "",
      "Status KAM": s.kamStatus,
      "Skor Pre Test": s.preTest ?? "",
      "LKM 1": s.lkm1 ? "Selesai" : "",
      "LKM 2": s.lkm2 ? "Selesai" : "",
      "LKM 3": s.lkm3 ? "Selesai" : "",
      "LKM 4": s.lkm4 ? "Selesai" : "",
      "LKM 5": s.lkm5 ? "Selesai" : "",
      "LKM 6": s.lkm6 ? "Selesai" : "",
      "LKM Selesai": s.lkmCompleted,
      "Skor Post Test": s.postTest ?? "",
      "Progress (%)": s.progress,
      Status: s.status,
      "Perlu Bantuan": s.needsAttention ? "Ya" : "Tidak",
    }));
    // Sheet name max 31 chars in Excel
    const sheetName = className.slice(0, 31) || "Tanpa Kelas";
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sheetData), sheetName);
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=laporan-pembelajaran.xlsx",
    },
  });
}

import { prisma } from "../prisma";
import { generateClassCode } from "../class-code";
import { classCreateSchema, teacherMessageSchema, teacherNoteSchema } from "../validations";

type StudentOverview = {
  id: string;
  name: string;
  nim: string;
  classId: string | null;
  className: string;
  kam: number | null;
  preTest: number | null;
  lkm1: boolean;
  lkm2: boolean;
  lkm3: boolean;
  lkm4: boolean;
  lkm5: boolean;
  lkm6: boolean;
  lkmCompleted: number;
  postTest: number | null;
  progress: number;
  status: string;
  needsAttention: boolean;
  missingFeedback: boolean;
  kamStatus: string;
  preTestStatus: string;
  moduleProgress: Record<number, string>;
  lkmProgress: Record<1 | 2 | 3 | 4 | 5 | 6, string>;
  postTestStatus: string;
  feedbackStatus: string;
  peerAssessmentStatus: string;
};

function average(values: Array<number | null | undefined>) {
  const actual = values.filter((value): value is number => typeof value === "number");
  if (!actual.length) return 0;
  return Math.round(actual.reduce((sum, value) => sum + value, 0) / actual.length);
}

function latestScore(attempts: Array<{ score: number | null; test: { type: string } }>, type: string) {
  return attempts.find((attempt) => attempt.test.type === type)?.score ?? null;
}

function lkmSubmitted(submissions: Array<{ submittedAt: Date | null; lkm: { number: number } }>, number: number): boolean {
  return submissions.some((submission) => submission.lkm.number === number && submission.submittedAt !== null);
}

function statusForStudent(overview: { kam: number | null; preTest: number | null; lkmCompleted: number; postTest: number | null }) {
  if (overview.kam === null || (overview.kam ?? 0) < 70) return "Belum Lulus KAM";
  if (overview.preTest === null) return "Belum Pre Test";
  if (overview.lkmCompleted < 6) return `Sedang LKM (${overview.lkmCompleted}/6)`;
  if (overview.postTest === null) return "Post Test Terbuka";
  return "Selesai";
}

export async function getStudentOverviews(teacherId?: string): Promise<StudentOverview[]> {
  const students = await prisma.student.findMany({
    where: teacherId ? { class: { teacherId } } : undefined,
    include: {
      user: true,
      class: true,
      testAttempts: { where: { status: "SUBMITTED" }, include: { test: true }, orderBy: { submittedAt: "desc" } },
      moduleProgress: { include: { module: true }, orderBy: { module: { title: "asc" } } },
      lkmSubmissions: { include: { lkm: true } },
      learningFeedback: { include: { lkm: true } },
      peerAssessments: { include: { lkm: true } }
    },
    orderBy: { user: { name: "asc" } }
  });

  return students.map((student) => {
    const kam = latestScore(student.testAttempts, "KAM");
    const preTest = latestScore(student.testAttempts, "PRE_TEST");
    const postTest = latestScore(student.testAttempts, "POST_TEST");
    const lkm1 = lkmSubmitted(student.lkmSubmissions, 1);
    const lkm2 = lkmSubmitted(student.lkmSubmissions, 2);
    const lkm3 = lkmSubmitted(student.lkmSubmissions, 3);
    const lkm4 = lkmSubmitted(student.lkmSubmissions, 4);
    const lkm5 = lkmSubmitted(student.lkmSubmissions, 5);
    const lkm6 = lkmSubmitted(student.lkmSubmissions, 6);
    const lkmCompleted = [lkm1, lkm2, lkm3, lkm4, lkm5, lkm6].filter(Boolean).length;
    const completed = [kam !== null, preTest !== null, lkmCompleted === 6, postTest !== null].filter(Boolean).length;
    const moduleStatus = student.moduleProgress[0]?.status ?? "NOT_STARTED";
    const missingFeedback = student.lkmSubmissions.some(
      (submission) => !student.learningFeedback.some((item) => item.lkmId === submission.lkmId)
    );
    const base = {
      id: student.id,
      name: student.user.name,
      nim: student.nim,
      classId: student.classId,
      className: student.class?.name ?? "-",
      kam,
      preTest,
      lkm1,
      lkm2,
      lkm3,
      lkm4,
      lkm5,
      lkm6,
      lkmCompleted,
      postTest,
      progress: Math.round((completed / 4) * 100)
    };
    const status = statusForStudent(base);
    return {
      ...base,
      status,
      needsAttention: status.includes("Belum Lulus") || missingFeedback || base.progress < 50,
      missingFeedback,
      kamStatus: kam === null ? "Belum Tes KAM" : (kam >= 70 ? "Lulus" : "Belum Lulus"),
      preTestStatus: preTest === null ? "Belum Pre Test" : "Selesai",
      moduleProgress: {
        1: moduleStatus
      },
      lkmProgress: {
        1: lkm1 ? "✅" : "—",
        2: lkm2 ? "✅" : "—",
        3: lkm3 ? "✅" : "—",
        4: lkm4 ? "✅" : "—",
        5: lkm5 ? "✅" : "—",
        6: lkm6 ? "✅" : "—"
      },
      postTestStatus: postTest === null ? "Belum Post Test" : "Selesai",
      feedbackStatus: missingFeedback ? "Belum lengkap" : "Lengkap",
      peerAssessmentStatus: student.peerAssessments.length > 0 ? "Ada penilaian" : "Belum ada"
    };
  });
}

export async function getTeacherDashboardSummary(teacherId: string) {
  const [classes, students] = await Promise.all([
    prisma.class.findMany({ where: { teacherId }, include: { students: true }, orderBy: { name: "asc" } }),
    getStudentOverviews(teacherId)
  ]);

  const classCards = classes.map((classItem) => {
    const classStudents = students.filter((student) => student.classId === classItem.id);
    return {
      id: classItem.id,
      name: classItem.name,
      code: classItem.code,
      count: classStudents.length,
      averageProgress: average(classStudents.map((student) => student.progress)),
      averageKam: average(classStudents.map((student) => student.kam)),
      attention: classStudents.filter((student) => student.needsAttention).length
    };
  });

  return {
    totalClasses: classes.length,
    totalStudents: students.length,
    passedKam: students.filter((student) => (student.kam ?? 0) >= 70).length,
    notPassedKam: students.filter((student) => student.kam !== null && (student.kam ?? 0) < 70).length,
    completedPreTest: students.filter((student) => student.preTest !== null).length,
    currentlyInLkm: students.filter((student) => student.status.includes("LKM")).length,
    completedPostTest: students.filter((student) => student.postTest !== null).length,
    overallAverageScore: average(students.flatMap((student) => [student.kam, student.preTest, student.postTest])),
    classCards,
    studentsNeedingAttention: students.filter((student) => student.needsAttention).slice(0, 6)
  };
}

export async function getTeacherClasses(teacherId: string) {
  return prisma.class.findMany({
    where: { teacherId },
    orderBy: [{ academicYear: "desc" }, { semester: "asc" }, { name: "asc" }]
  });
}

export async function getClassesForTeacher(teacherId: string, searchParams?: Record<string, string | string[] | undefined>) {
  const summary = await getTeacherDashboardSummary(teacherId);
  let cards = summary.classCards;
  const query = typeof searchParams?.q === "string" ? searchParams.q.toLowerCase() : "";
  const semester = typeof searchParams?.semester === "string" ? searchParams.semester : "";
  const academicYear = typeof searchParams?.academicYear === "string" ? searchParams.academicYear : "";
  if (query) cards = cards.filter((card) => card.name.toLowerCase().includes(query));
  if (semester) {
    const classes = await getTeacherClasses(teacherId);
    const allowed = new Set(classes.filter((item) => item.semester === semester).map((item) => item.id));
    cards = cards.filter((card) => allowed.has(card.id));
  }
  if (academicYear) {
    const classes = await getTeacherClasses(teacherId);
    const allowed = new Set(classes.filter((item) => item.academicYear === academicYear).map((item) => item.id));
    cards = cards.filter((card) => allowed.has(card.id));
  }
  const sort = searchParams?.sort;
  if (sort === "score") cards = [...cards].sort((a, b) => b.averageKam - a.averageKam);
  if (sort === "progress") cards = [...cards].sort((a, b) => b.averageProgress - a.averageProgress);
  return cards;
}

export async function createClassForTeacher(teacherId: string, input: unknown) {
  const parsed = classCreateSchema.parse(input);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateClassCode();
    try {
      return await prisma.class.create({
        data: {
          name: parsed.name,
          semester: parsed.semester,
          academicYear: parsed.academicYear,
          teacherId,
          code
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unique constraint")) continue;
      throw error;
    }
  }
  throw new Error("Gagal membuat kode kelas unik. Coba lagi.");
}

export async function getClassDashboard(classId: string) {
  const classItem = await prisma.class.findUnique({ where: { id: classId }, include: { teacher: { include: { user: true } } } });
  if (!classItem) throw new Error("Kelas tidak ditemukan.");
  const students = (await getStudentOverviews(classItem.teacherId)).filter((student) => student.classId === classId);
  const completion = {
    kam: Math.round((students.filter((student) => student.kam !== null).length / Math.max(students.length, 1)) * 100),
    preTest: Math.round((students.filter((student) => student.preTest !== null).length / Math.max(students.length, 1)) * 100),
    "LKM 1": Math.round((students.filter((student) => student.lkm1).length / Math.max(students.length, 1)) * 100),
    "LKM 2": Math.round((students.filter((student) => student.lkm2).length / Math.max(students.length, 1)) * 100),
    "LKM 3": Math.round((students.filter((student) => student.lkm3).length / Math.max(students.length, 1)) * 100),
    "LKM 4": Math.round((students.filter((student) => student.lkm4).length / Math.max(students.length, 1)) * 100),
    "LKM 5": Math.round((students.filter((student) => student.lkm5).length / Math.max(students.length, 1)) * 100),
    "LKM 6": Math.round((students.filter((student) => student.lkm6).length / Math.max(students.length, 1)) * 100),
    postTest: Math.round((students.filter((student) => student.postTest !== null).length / Math.max(students.length, 1)) * 100)
  };

  return {
    classItem,
    students,
    averageScore: average(students.flatMap((student) => [student.kam, student.preTest, student.postTest])),
    completion,
    chart: [
      { name: "KAM", score: average(students.map((student) => student.kam)) },
      { name: "Pre Test", score: average(students.map((student) => student.preTest)) },
      { name: "Post Test", score: average(students.map((student) => student.postTest)) }
    ],
    lkmStatus: [1, 2, 3, 4, 5, 6].map((n) => ({
      name: `LKM ${n}`,
      completed: students.filter((student) => student[`lkm${n}` as keyof typeof student]).length,
      total: students.length
    })),
    needingAssistance: students.filter((student) => student.needsAttention)
  };
}

export async function getStudentDetailForTeacher(studentId: string) {
  const [student, overviews, feedback, learningFeedback, peerAssessments, notes] = await Promise.all([
    prisma.student.findUnique({ where: { id: studentId }, include: { user: true, class: true } }),
    getStudentOverviews(),
    prisma.automaticFeedback.findMany({ where: { studentId }, orderBy: { createdAt: "desc" } }),
    prisma.learningFeedback.findMany({ where: { studentId }, include: { lkm: true }, orderBy: { createdAt: "desc" } }),
    prisma.peerAssessment.findMany({ where: { studentId }, include: { lkm: true }, orderBy: { createdAt: "desc" } }),
    prisma.teacherNote.findMany({ where: { studentId }, include: { teacher: { include: { user: true } } }, orderBy: { createdAt: "desc" } })
  ]);
  if (!student) throw new Error("Mahasiswa tidak ditemukan.");
  const overview = overviews.find((item) => item.id === studentId);
  return {
    student,
    overview,
    feedback,
    learningFeedback,
    peerAssessments,
    notes,
    weakTopics: Array.from(new Set(feedback.flatMap((item) => item.weakTopics))).slice(0, 3),
    recommendation: feedback[0]?.recommendation ?? "Belum ada rekomendasi otomatis."
  };
}

export async function getProgressMahasiswa(teacherId: string, filters?: Record<string, string | string[] | undefined>) {
  let students = await getStudentOverviews(teacherId);
  const q = typeof filters?.q === "string" ? filters.q.toLowerCase() : "";
  const classId = typeof filters?.classId === "string" ? filters.classId : "";
  const status = typeof filters?.status === "string" ? filters.status : "";
  if (q) students = students.filter((student) => `${student.name} ${student.nim}`.toLowerCase().includes(q));
  if (classId) students = students.filter((student) => student.classId === classId);
  if (status) students = students.filter((student) => student.status === status);
  if (filters?.notPassedKam === "true") students = students.filter((student) => student.kam !== null && (student.kam ?? 0) < 70);
  if (filters?.missingFeedback === "true") students = students.filter((student) => student.missingFeedback);
  if (filters?.notCompletedPostTest === "true") students = students.filter((student) => student.postTest === null);
  return students;
}

export async function getRekapNilai(teacherId: string, filters?: Record<string, string | string[] | undefined>) {
  let students = await getStudentOverviews(teacherId);
  const classId = typeof filters?.classId === "string" ? filters.classId : "";
  const status = typeof filters?.status === "string" ? filters.status : "";
  if (classId) students = students.filter((student) => student.classId === classId);
  return students.map((student) => ({
    ...student,
    averageScore: average([student.kam, student.preTest, student.postTest]),
    finalStatus: student.postTest !== null ? "Selesai" : "Belum Selesai"
  })).filter((student) => (status ? student.finalStatus === status : true));
}

export function groupRowsByClass<T extends { classId: string | null; className: string }>(rows: T[]) {
  const grouped = new Map<string, { classId: string | null; className: string; rows: T[] }>();
  for (const row of rows) {
    const key = row.classId ?? "tanpa-kelas";
    const item = grouped.get(key) ?? { classId: row.classId, className: row.className, rows: [] };
    item.rows.push(row);
    grouped.set(key, item);
  }
  return Array.from(grouped.values()).sort((a, b) => a.className.localeCompare(b.className));
}

export async function getFeedbackAndPeerReport(teacherId: string, filters?: Record<string, string | string[] | undefined>) {
  const classId = typeof filters?.classId === "string" ? filters.classId : "";
  const lkmNumber = typeof filters?.lkm === "string" && filters.lkm ? Number(filters.lkm) : null;
  const q = typeof filters?.q === "string" ? filters.q.toLowerCase() : "";

  const studentWhere = {
    class: { teacherId, ...(classId ? { id: classId } : {}) },
    ...(q ? { user: { name: { contains: q, mode: "insensitive" as const } } } : {})
  };

  const [students, feedbackRows, peerRows] = await Promise.all([
    prisma.student.findMany({ where: studentWhere, include: { user: true, class: true } }),
    prisma.learningFeedback.findMany({
      where: {
        student: studentWhere,
        ...(lkmNumber ? { lkm: { number: lkmNumber } } : {})
      },
      include: { student: { include: { user: true, class: true } }, lkm: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.peerAssessment.findMany({
      where: {
        student: studentWhere,
        ...(lkmNumber ? { lkm: { number: lkmNumber } } : {})
      },
      include: { student: { include: { user: true, class: true } }, lkm: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const averageRating = average(feedbackRows.map((item) => item.rating));
  return {
    studentsCount: students.length,
    feedbackRows,
    peerRows,
    stats: {
      feedbackCount: feedbackRows.length,
      averageRating,
      studentsWithFeedback: new Set(feedbackRows.map((item) => item.studentId)).size,
      studentsWithoutFeedback: Math.max(0, students.length - new Set(feedbackRows.map((item) => item.studentId)).size),
      peerAssessmentCount: peerRows.length
    }
  };
}

export async function sendTeacherMessage(teacherId: string, studentId: string, input: unknown) {
  const parsed = teacherMessageSchema.parse(input);
  const student = await prisma.student.findFirst({ where: { id: studentId, class: { teacherId } }, include: { user: true } });
  if (!student) throw new Error("Mahasiswa tidak ditemukan pada kelas dosen ini.");
  return prisma.teacherMessage.create({
    data: {
      teacherId,
      studentId,
      title: parsed.title,
      content: parsed.content
    }
  });
}

export async function getLaporanPembelajaran(teacherId: string) {
  const [classes, students] = await Promise.all([prisma.class.findMany({ where: { teacherId } }), getStudentOverviews(teacherId)]);
  const classChart = classes.map((classItem) => {
    const classStudents = students.filter((student) => student.classId === classItem.id);
    return { name: classItem.name, score: average(classStudents.map((student) => student.postTest ?? student.preTest ?? student.kam)) };
  });
  const weakTopicRows = await prisma.automaticFeedback.findMany({ where: { student: { class: { teacherId } } } });
  const weakTopics = weakTopicRows.flatMap((item) => item.weakTopics);
  const mostCommonWeakTopics = [...new Set(weakTopics)].map((topic) => ({
    topic,
    count: weakTopics.filter((item) => item === topic).length
  }));

  return {
    classChart,
    prePostChart: [
      { name: "Pre Test", score: average(students.map((student) => student.preTest)) },
      { name: "Post Test", score: average(students.map((student) => student.postTest)) }
    ],
    passedKamPercentage: Math.round((students.filter((student) => (student.kam ?? 0) >= 70).length / Math.max(students.length, 1)) * 100),
    lkmCompletion: [
      { name: "LKM 1", value: Math.round((students.filter((student) => student.lkm1).length / Math.max(students.length, 1)) * 100) },
      { name: "LKM 2", value: Math.round((students.filter((student) => student.lkm2).length / Math.max(students.length, 1)) * 100) },
      { name: "LKM 3", value: Math.round((students.filter((student) => student.lkm3).length / Math.max(students.length, 1)) * 100) },
      { name: "LKM 4", value: Math.round((students.filter((student) => student.lkm4).length / Math.max(students.length, 1)) * 100) },
      { name: "LKM 5", value: Math.round((students.filter((student) => student.lkm5).length / Math.max(students.length, 1)) * 100) },
      { name: "LKM 6", value: Math.round((students.filter((student) => student.lkm6).length / Math.max(students.length, 1)) * 100) }
    ],
    mostCommonWeakTopics: mostCommonWeakTopics.sort((a, b) => b.count - a.count).slice(0, 3),
    studentsNeedingAssistance: students.filter((student) => student.needsAttention).slice(0, 8),
    recommendations:
      "Sebagian besar mahasiswa yang belum stabil perlu penguatan pada materi pemecahan masalah matematis melalui diskusi tambahan dan latihan bertahap."
  };
}

export async function addTeacherNote(teacherId: string, studentId: string, input: unknown) {
  const parsed = teacherNoteSchema.parse(input);
  return prisma.teacherNote.create({
    data: { teacherId, studentId, noteText: parsed.noteText }
  });
}

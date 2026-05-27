import { Badge, ButtonLink, Card, PageHeader, ScoreCard, SecondaryLink } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireTeacherProfile } from "@/lib/route-guards";

export default async function DashboardGuruPage() {
  const { teacher } = await requireTeacherProfile();

  // Get classes with student counts and progress data
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    include: {
      students: {
        include: {
          lkmSubmissions: { where: { submittedAt: { not: null } }, select: { lkmId: true } }
        }
      },
      _count: { select: { students: true } }
    }
  });

  // Get overall stats
  const allStudentIds = classes.flatMap((c) => c.students.map((s) => s.id));

  const [kamAttempts, preTestAttempts, postTestAttempts, lkmSubmissions] = await Promise.all([
    prisma.studentTestAttempt.count({
      where: { studentId: { in: allStudentIds }, test: { type: "KAM" }, status: "SUBMITTED" }
    }),
    prisma.studentTestAttempt.count({
      where: { studentId: { in: allStudentIds }, test: { type: "PRE_TEST" }, status: "SUBMITTED" }
    }),
    prisma.studentTestAttempt.count({
      where: { studentId: { in: allStudentIds }, test: { type: "POST_TEST" }, status: "SUBMITTED" }
    }),
    prisma.studentLKMSubmission.groupBy({
      by: ["studentId"],
      where: { studentId: { in: allStudentIds }, submittedAt: { not: null } },
      _count: true
    })
  ]);

  const studentsInLkm = lkmSubmissions.filter((s) => s._count > 0 && s._count < 6).length;
  const studentsCompletedAllLkm = lkmSubmissions.filter((s) => s._count >= 6).length;

  const totalStudents = allStudentIds.length;

  // Per-class summary
  const classCards = classes.map((cls) => {
    const studentCount = cls._count.students;
    const studentsWithLkm = cls.students.filter((s) => s.lkmSubmissions.length > 0).length;
    const avgLkm = studentCount > 0
      ? Math.round(cls.students.reduce((sum, s) => sum + s.lkmSubmissions.length, 0) / studentCount * 100 / 6)
      : 0;

    return {
      id: cls.id,
      name: cls.name,
      code: cls.code,
      semester: cls.semester,
      academicYear: cls.academicYear,
      studentCount,
      studentsWithLkm,
      avgProgress: avgLkm
    };
  });

  return (
    <>
      <PageHeader title="Dashboard Dosen" description="Ringkasan kelas, progres mahasiswa, dan aksi cepat." />
      <div className="grid gap-4">
        {/* Overview Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Total Kelas" value={classes.length} />
          <ScoreCard label="Total Mahasiswa" value={totalStudents} />
          <ScoreCard label="Selesai KAM" value={kamAttempts} />
          <ScoreCard label="Selesai Pre Test" value={preTestAttempts} />
          <ScoreCard label="Sedang LKM" value={studentsInLkm} />
          <ScoreCard label="LKM 1-6 Selesai" value={studentsCompletedAllLkm} />
          <ScoreCard label="Selesai Post Test" value={postTestAttempts} />
          <ScoreCard label="Progres Rata-rata" value={totalStudents > 0 ? Math.round(((kamAttempts + preTestAttempts + studentsCompletedAllLkm + postTestAttempts) / (totalStudents * 4)) * 100) : 0} />
        </div>

        {/* Class List */}
        <Card title="Daftar Kelas" action={<ButtonLink href="/guru/kelas">Lihat Semua</ButtonLink>}>
          <div className="grid gap-3 lg:grid-cols-2">
            {classCards.map((cls) => (
              <div key={cls.id} className="rounded-2xl border border-border bg-white p-4 shadow-subtle">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-950">{cls.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      Kode: {cls.code} | {cls.studentCount} Mahasiswa | {cls.semester} {cls.academicYear}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Progres LKM rata-rata: {cls.avgProgress}% | {cls.studentsWithLkm} sudah mulai LKM
                    </p>
                  </div>
                  <Badge tone={cls.avgProgress >= 50 ? "success" : "warning"}>{cls.avgProgress}%</Badge>
                </div>
              </div>
            ))}
            {classCards.length === 0 && (
              <p className="text-sm text-muted">Belum ada kelas.</p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Aksi Cepat">
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/guru/progress">Lihat Progres Mahasiswa</ButtonLink>
            <ButtonLink href="/guru/lkm-feedback">Beri Feedback LKM</ButtonLink>
            <SecondaryLink href="/guru/feedback">Laporan Feedback Pembelajaran</SecondaryLink>
            <SecondaryLink href="/guru/rekap">Rekap Nilai</SecondaryLink>
            <SecondaryLink href="/guru/laporan">Laporan Analitik</SecondaryLink>
          </div>
        </Card>
      </div>
    </>
  );
}

import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireTeacherProfile } from "@/lib/route-guards";

export default async function SecurityLogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { teacher } = await requireTeacherProfile();
  const params = await searchParams;
  const filterClass = typeof params.classId === "string" ? params.classId : "";
  const filterType = typeof params.type === "string" ? params.type : "";

  // Get teacher's classes
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    select: { id: true, name: true }
  });
  const classIds = classes.map((c) => c.id);

  // Get students in teacher's classes
  const students = await prisma.student.findMany({
    where: { classId: { in: classIds }, ...(filterClass ? { classId: filterClass } : {}) },
    select: { id: true, nim: true, classId: true, user: { select: { name: true, email: true } }, class: { select: { name: true } } }
  });
  const studentIds = students.map((s) => s.id);
  const studentMap = new Map(students.map((s) => [s.id, s]));

  // Get security-related activity logs
  const securityTypes = [
    // KAM / Pre Test / Post Test
    "SECURITY_TAB_HIDDEN",
    "SECURITY_TAB_BLUR",
    "SECURITY_COPY_ATTEMPT",
    "SECURITY_PASTE_ATTEMPT",
    "SECURITY_CUT_ATTEMPT",
    "SECURITY_RIGHT_CLICK",
    "SECURITY_FULLSCREEN_EXIT",
    "SECURITY_WARNING",
    // LKM
    "LKM_QUESTION_COPY_ATTEMPT",
    "LKM_QUESTION_CUT_ATTEMPT",
    "LKM_QUESTION_RIGHT_CLICK_ATTEMPT",
  ];

  const logs = await prisma.activityLog.findMany({
    where: {
      studentId: { in: studentIds },
      activityType: { in: filterType ? [filterType] : securityTypes }
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  // Summary stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLogs = logs.filter((l) => l.createdAt >= today);

  const tabHidden = logs.filter((l) => l.activityType.includes("TAB_HIDDEN") || l.activityType.includes("TAB_BLUR")).length;
  const copyAttempts = logs.filter((l) => l.activityType.includes("COPY") || l.activityType.includes("CUT") || l.activityType.includes("PASTE")).length;
  const rightClick = logs.filter((l) => l.activityType.includes("RIGHT_CLICK")).length;

  // Top offenders
  const countByStudent = new Map<string, number>();
  for (const log of logs) {
    countByStudent.set(log.studentId, (countByStudent.get(log.studentId) ?? 0) + 1);
  }
  const topOffenders = Array.from(countByStudent.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({ student: studentMap.get(id), count }));

  return (
    <>
      <PageHeader title="Log Aktivitas Keamanan" description="Catatan aktivitas mencurigakan mahasiswa selama pengerjaan ujian dan LKM." />

      {/* Filters */}
      <Card title="Filter">
        <form className="grid gap-3 sm:grid-cols-3">
          <select name="classId" className="form-input" defaultValue={filterClass}>
            <option value="">Semua Kelas</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="type" className="form-input" defaultValue={filterType}>
            <option value="">Semua Jenis</option>
            {securityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong">Filter</button>
        </form>
      </Card>

      {/* Summary */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Hari Ini" value={todayLogs.length} />
        <StatCard label="Total Semua" value={logs.length} />
        <StatCard label="Keluar Tab" value={tabHidden} />
        <StatCard label="Copy/Cut/Paste" value={copyAttempts} />
        <StatCard label="Klik Kanan" value={rightClick} />
      </div>

      {/* Top Offenders */}
      {topOffenders.length > 0 && (
        <Card title="Mahasiswa dengan Peringatan Terbanyak" className="mt-4">
          <div className="space-y-2">
            {topOffenders.map(({ student: s, count }) => s && (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <div>
                  <p className="font-semibold text-stone-800">{s.user.name}</p>
                  <p className="text-xs text-muted">{s.nim} | {s.class?.name ?? "-"}</p>
                </div>
                <Badge tone={count >= 5 ? "error" : count >= 3 ? "warning" : "neutral"}>{count} peringatan</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Log Table */}
      <Card title="Detail Log" className="mt-4">
        {logs.length === 0 ? (
          <EmptyState title="Belum ada log" description="Aktivitas mencurigakan akan muncul di sini." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-xs font-semibold uppercase text-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Mahasiswa</th>
                  <th className="px-3 py-2 text-left">Kelas</th>
                  <th className="px-3 py-2 text-left">Jenis</th>
                  <th className="px-3 py-2 text-left">Keterangan</th>
                  <th className="px-3 py-2 text-left">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const s = studentMap.get(log.studentId);
                  return (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-stone-50">
                      <td className="px-3 py-2">
                        <p className="font-medium">{s?.user.name ?? "-"}</p>
                        <p className="text-xs text-muted">{s?.nim ?? "-"}</p>
                      </td>
                      <td className="px-3 py-2 text-xs">{s?.class?.name ?? "-"}</td>
                      <td className="px-3 py-2"><Badge tone="warning">{log.activityType.replace("SECURITY_", "").replace("LKM_", "LKM ")}</Badge></td>
                      <td className="max-w-xs px-3 py-2 text-xs text-muted truncate">{log.description}</td>
                      <td className="px-3 py-2 text-xs text-muted whitespace-nowrap">{log.createdAt.toLocaleString("id-ID")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-3 shadow-subtle">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-stone-950">{value}</p>
    </div>
  );
}

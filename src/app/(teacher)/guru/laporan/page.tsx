import { SimpleBarChart } from "@/components/charts/score-line-chart";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";
import { getLaporanPembelajaran } from "@/lib/services/teacher-service";

export default async function LaporanPembelajaranPage() {
  const { teacher } = await requireTeacherProfile();
  const report = await getLaporanPembelajaran(teacher.id);
  return (
    <>
      <PageHeader title="Laporan Pembelajaran" description="Analitik kelas, perbandingan skor, topik lemah, dan rekomendasi tindakan." />
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Rata-rata Skor per Kelas" description="Dihitung dari rata-rata KAM, Pre Test, dan Post Test mahasiswa per kelas.">
            <SimpleBarChart data={report.classChart} />
          </Card>
          <Card title="Pre Test vs Post Test" description="Rata-rata skor seluruh mahasiswa.">
            <SimpleBarChart data={report.prePostChart} />
          </Card>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Lulus KAM"><p className="text-3xl font-semibold">{report.passedKamPercentage}%</p><p className="mt-1 text-xs text-muted">Dari seluruh mahasiswa yang mengerjakan KAM</p></Card>
          <Card title="Penyelesaian LKM"><SimpleBarChart data={report.lkmCompletion} /></Card>
          <Card title="Topik Lemah Umum" description="Berdasarkan persentase jawaban salah mahasiswa pada soal terkait.">
            {report.mostCommonWeakTopics.length === 0 ? (
              <p className="text-sm text-muted">Belum ada data yang cukup untuk dianalisis.</p>
            ) : (
              <div className="space-y-2">
                {report.mostCommonWeakTopics.map((item) => (
                  <div key={item.topic} className="flex items-center justify-between rounded-lg border border-border p-2">
                    <span className="text-sm text-stone-700">{item.topic}</span>
                    <Badge tone={item.errorRate > 60 ? "error" : item.errorRate > 40 ? "warning" : "neutral"}>
                      {item.errorRate}% salah
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Feedback Summary */}
        {report.feedbackSummary && report.feedbackSummary.totalResponden > 0 && (
          <Card title="Ringkasan Feedback Pembelajaran" description="Data kuantitatif dan kualitatif dari refleksi mahasiswa setelah LKM.">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-stone-800">Data Kuantitatif</h3>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Metric label="Jumlah Responden" value={report.feedbackSummary.totalResponden} />
                  <Metric label="Rating Rata-rata" value={`${report.feedbackSummary.averageRating}/5`} />
                </div>
                <div className="space-y-1">
                  {report.feedbackSummary.distribution.map((d) => (
                    <div key={d.rating} className="flex items-center gap-2 text-sm">
                      <span className="w-16 text-muted">Rating {d.rating}</span>
                      <div className="h-2 flex-1 rounded-full bg-stone-100">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${d.percentage}%` }} />
                      </div>
                      <span className="w-20 text-right text-xs text-muted">{d.count} ({d.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-stone-800">Tema Umum dari Respons</h3>
                {report.feedbackSummary.themes.length > 0 ? (
                  <div className="space-y-2">
                    {report.feedbackSummary.themes.map((t) => (
                      <div key={t.theme} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
                        <span>{t.theme}</span>
                        <Badge tone="neutral">{t.count}x disebut</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Belum cukup data untuk analisis tema.</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Students Needing Assistance */}
        <Card
          title="Students Needing Assistance"
          description="Daftar ini dihitung berdasarkan skor tes (KAM/Pre/Post < 70), progres LKM, dan indikator kesulitan."
        >
          {report.studentsNeedingAssistance.length === 0 ? (
            <EmptyState title="Tidak ada mahasiswa yang memerlukan bantuan saat ini" description="Semua mahasiswa menunjukkan progres yang baik." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-xs font-semibold uppercase text-muted">
                  <tr>
                    <th className="px-3 py-2 text-left">Nama</th>
                    <th className="px-3 py-2 text-left">Kelas</th>
                    <th className="px-3 py-2 text-center">KAM</th>
                    <th className="px-3 py-2 text-center">Pre Test</th>
                    <th className="px-3 py-2 text-center">Post Test</th>
                    <th className="px-3 py-2 text-center">LKM</th>
                    <th className="px-3 py-2 text-left">Alasan</th>
                  </tr>
                </thead>
                <tbody>
                  {report.studentsNeedingAssistance.map((student) => (
                    <tr key={student.id} className="border-b border-border/50 hover:bg-stone-50">
                      <td className="px-3 py-2 font-medium">{student.name}</td>
                      <td className="px-3 py-2 text-muted">{student.className}</td>
                      <td className="px-3 py-2 text-center">{student.kam ?? "-"}</td>
                      <td className="px-3 py-2 text-center">{student.preTest ?? "-"}</td>
                      <td className="px-3 py-2 text-center">{student.postTest ?? "-"}</td>
                      <td className="px-3 py-2 text-center">{student.lkmCompleted}/6</td>
                      <td className="px-3 py-2"><Badge tone="warning">{student.reason}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Recommendations */}
        <Card title="Rekomendasi Tindakan" description="Rekomendasi dibuat berdasarkan data aktual mahasiswa dan performa per topik.">
          <p className="text-sm leading-6 text-stone-700">{report.recommendations}</p>
        </Card>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
      <p className="text-xs font-semibold uppercase text-red-900">{label}</p>
      <p className="mt-1 text-lg font-semibold text-stone-950">{value}</p>
    </div>
  );
}

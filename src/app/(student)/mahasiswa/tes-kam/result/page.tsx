import { Badge, ButtonLink, Card, EmptyState, PageHeader, SecondaryLink } from "@/components/ui";
import { KAM_KKM } from "@/lib/constants";
import { formatMath } from "@/lib/math-format";
import { getStudentLearningAccess } from "@/lib/learning-access";
import { requireStudentProfile } from "@/lib/route-guards";
import { getKamResultWithReview } from "@/lib/services/student-service";

export default async function TesKamResultPage() {
  const { student } = await requireStudentProfile();
  const [result, access] = await Promise.all([
    getKamResultWithReview(student.id),
    getStudentLearningAccess(student.id)
  ]);

  if (!result) {
    return <EmptyState title="Belum ada hasil Tes KAM" description="Selesaikan Tes KAM terlebih dahulu." />;
  }

  const { score, passed, kkm, review } = result;
  const modulePdfUrl = "/modules/PGSD-MODUL-2-Matematika-gabungan.pdf";

  return (
    <>
      <PageHeader title="Hasil Tes KAM" description="Hasil ini menentukan tahap pembelajaran berikutnya." />

      {/* Score Card */}
      <Card title={passed ? "✅ Lulus KAM" : "⚠️ Belum Lulus KAM"} action={<Badge tone={passed ? "success" : "warning"}>Skor {score}</Badge>}>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
          <p className="text-lg font-semibold">Skor Anda: {score} / 100</p>
          <p className="mt-1 text-muted">KKM: {kkm}</p>
        </div>

        {passed ? (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-semibold">✅ Anda lulus KAM. Lanjutkan ke Pre Test.</p>
            <div className="mt-3">
              <ButtonLink href="/mahasiswa/pre-test">Lanjut ke Pre Test</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">⚠️ Skor Anda belum mencapai KKM ({kkm}).</p>
            <p className="mt-2">
              Anda disarankan mempelajari Modul 2 Pendalaman Materi Matematika,
              khususnya bagian Geometri dan Pengukuran, sebelum melanjutkan pembelajaran.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={modulePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong"
              >
                Buka Modul
              </a>
              <a
                href={modulePdfUrl}
                download="PGSD-MODUL-2-Matematika-gabungan.pdf"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-primary"
              >
                Unduh Modul
              </a>
              {access.canRetakeKAM ? (
                <ButtonLink href="/mahasiswa/tes-kam/attempt">Lanjut Setelah Membaca</ButtonLink>
              ) : (
                <SecondaryLink href="/mahasiswa/modul" className="opacity-80">
                  Lanjut Setelah Membaca
                </SecondaryLink>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Review Table — only shown if passed */}
      {passed && review && (
      <Card title="Review Soal KAM" description="Tinjau jawaban Anda beserta kunci dan pembahasan." className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold uppercase text-muted">
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">Soal</th>
                <th className="px-3 py-2">Jawaban Anda</th>
                <th className="px-3 py-2">Kunci</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {review.map((item) => (
                <tr key={item.questionNumber} className="border-b border-border/50 hover:bg-stone-50">
                  <td className="px-3 py-2 font-medium">{item.questionNumber}</td>
                  <td className="max-w-xs px-3 py-2">
                    <p className="line-clamp-2 text-stone-700">{formatMath(item.questionText)}</p>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt ?? `Gambar soal nomor ${item.questionNumber}`}
                        className="mt-1 max-w-[200px] rounded border"
                      />
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium">{item.selectedAnswer}</td>
                  <td className="px-3 py-2 font-medium">{item.correctAnswer}</td>
                  <td className="px-3 py-2">{item.isCorrect ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explanations */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-stone-800">Pembahasan</h3>
          {review.map((item) => (
            <div key={`exp-${item.questionNumber}`} className="rounded-xl border border-border/50 bg-stone-50 p-3 text-sm">
              <p className="font-medium text-stone-800">
                Nomor {item.questionNumber} {item.isCorrect ? "✅" : "❌"} — Kunci: {item.correctAnswer}
              </p>
              {item.explanation && (
                <p className="mt-1 text-muted">{formatMath(item.explanation)}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
      )}
    </>
  );
}

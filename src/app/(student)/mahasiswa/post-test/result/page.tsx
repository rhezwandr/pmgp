import { redirect } from "next/navigation";

import { Badge, ButtonLink, Card, PageHeader } from "@/components/ui";
import { formatMath } from "@/lib/math-format";
import { guardStudentAccess } from "@/lib/route-guards";
import { getPostTestResultWithReview } from "@/lib/services/student-service";

export default async function PostTestResultPage() {
  const { student } = await guardStudentAccess("postTest");
  const data = await getPostTestResultWithReview(student.id);
  if (!data) redirect("/mahasiswa/post-test");

  const { score, review } = data;

  return (
    <>
      <PageHeader title="Hasil Post Test" description="Review jawaban dan pembahasan setelah submit." />

      <Card title="Skor Post Test" action={<Badge tone="success">Skor {score}</Badge>}>
        <p className="text-sm text-muted">
          Anda telah menyelesaikan Post Test. Berikut review soal beserta pembahasan.
        </p>
        <div className="mt-4">
          <ButtonLink href="/mahasiswa/dashboard">Kembali ke Dashboard</ButtonLink>
        </div>
      </Card>

      <div className="mt-6 space-y-4">
        {review.map((item) => (
          <Card key={item.questionNumber} className="relative">
            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-700">
                {item.questionNumber}
              </span>
              <span className="text-sm font-semibold">
                {item.isCorrect ? "✅ Benar" : "❌ Salah"}
              </span>
            </div>

            {/* Question text */}
            <p className="text-sm text-stone-800">{formatMath(item.questionText)}</p>

            {/* Image if available */}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.imageAlt ?? `Gambar soal nomor ${item.questionNumber}`}
                className="my-3 max-w-full rounded-md border"
              />
            )}

            {/* Options */}
            <div className="mt-3 space-y-1.5">
              {(["A", "B", "C", "D"] as const).map((key) => {
                const optionText = item[`option${key}` as keyof typeof item] as string;
                const isSelected = item.selectedAnswer === key;
                const isCorrect = item.correctAnswer === key;
                const isImage = optionText.startsWith("/assets/") || optionText.startsWith("http");

                let className = "rounded-lg border px-3 py-2 text-sm";
                if (isCorrect) {
                  className += " border-green-300 bg-green-50 text-green-800 font-medium";
                } else if (isSelected && !isCorrect) {
                  className += " border-blue-300 bg-blue-50 text-blue-800";
                } else {
                  className += " border-border bg-white text-stone-600";
                }

                return (
                  <div key={key} className={className}>
                    <span className="mr-2 font-semibold">{key}.</span>
                    {isImage
                      ? <img src={optionText} alt={`Opsi ${key}`} className="mt-1 max-h-24 rounded border" />
                      : formatMath(optionText)
                    }
                    {isSelected && !isCorrect && <span className="ml-2 text-xs text-blue-600">(Jawaban Anda)</span>}
                    {isCorrect && <span className="ml-2 text-xs text-green-600">(Jawaban Benar)</span>}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {item.explanation && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <p className="font-semibold">Pembahasan:</p>
                <p className="mt-1">{formatMath(item.explanation)}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

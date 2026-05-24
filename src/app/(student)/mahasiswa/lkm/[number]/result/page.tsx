import { redirect } from "next/navigation";

import { ButtonLink, Card, PageHeader, SecondaryLink } from "@/components/ui";
import { lkmContents } from "@/lib/lkm-content";
import { formatMath } from "@/lib/math-format";
import { prisma } from "@/lib/prisma";
import { requireStudentProfile } from "@/lib/route-guards";
import { getLkmForStudent } from "@/lib/services/student-service";

export default async function LkmResultPage({ params }: { params: Promise<{ number: string }> }) {
  const { student } = await requireStudentProfile();
  const { number } = await params;
  const num = Number(number);
  const lkm = await getLkmForStudent(student.id, num);
  const submission = lkm.submissions[0];
  if (!submission) redirect(`/mahasiswa/lkm/${num}/attempt`);

  const content = lkmContents.find((l) => l.lkmNumber === num);

  // Check for lecturer feedback
  const lecturerFeedback = await prisma.teacherLkmFeedback.findFirst({
    where: { studentId: student.id, lkmId: lkm.id },
    include: { teacher: { include: { user: { select: { name: true } } } } },
    orderBy: { updatedAt: "desc" }
  });

  // Parse answers
  let answers: Record<string, string> = {};
  try {
    answers = JSON.parse(submission.answerText);
  } catch {
    answers = { plain: submission.answerText };
  }

  const nextLkm = num < 6 ? num + 1 : null;

  return (
    <>
      <PageHeader title={`✅ LKM ${num} berhasil disubmit.`} description={content?.title ?? lkm.title} />

      <div className="space-y-4">
        {/* Answers per section */}
        {content?.sections.map((section) => (
          <Card key={section.id} title={`${section.phase}: ${section.title}`}>
            <div className="space-y-3">
              {section.items
                .filter((item) => item.type === "prompt" || item.type === "question" || item.type === "table")
                .map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-stone-50 p-3 text-sm">
                    <p className="font-medium text-stone-600">{formatMath(item.content)}</p>
                    <p className="mt-2 whitespace-pre-wrap text-stone-800">
                      {answers[item.id] || "(Belum dijawab)"}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        ))}

        {/* Fallback if no content structure */}
        {!content && (
          <Card title="Jawaban Anda">
            <pre className="whitespace-pre-wrap text-sm text-stone-700">{submission.answerText}</pre>
          </Card>
        )}

        {/* Lecturer feedback */}
        {lecturerFeedback && (
          <Card title="Feedback Dosen">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              <p className="font-semibold">Feedback Dosen: {lecturerFeedback.teacher.user.name}</p>
              <p className="mt-1 whitespace-pre-wrap">{lecturerFeedback.feedbackText}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex flex-wrap gap-2">
        {nextLkm ? (
          <ButtonLink href={`/mahasiswa/lkm/${nextLkm}`}>Lanjut ke LKM {nextLkm}</ButtonLink>
        ) : (
          <ButtonLink href="/mahasiswa/post-test">Lanjut ke Post Test</ButtonLink>
        )}
        <SecondaryLink href="/mahasiswa/dashboard">Kembali ke Dashboard</SecondaryLink>
      </div>
    </>
  );
}

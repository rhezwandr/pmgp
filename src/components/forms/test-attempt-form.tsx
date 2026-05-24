"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { formatMath } from "@/lib/math-format";

type Question = {
  id: string;
  questionText: string;
  questionNumber?: number | null;
  questionImage?: string | null;
  imageAlt?: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string | null;
};

type AnswerKey = "A" | "B" | "C" | "D" | "E";

export function TestAttemptForm({
  questions,
  durationMinutes,
  submitEndpoint,
  resultPath
}: {
  questions: Question[];
  durationMinutes: number;
  submitEndpoint: string;
  resultPath: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({});
  const [error, setError] = useState("");
  const remaining = useMemo(() => `${durationMinutes}:00`, [durationMinutes]);
  const question = questions[active];

  const options: AnswerKey[] = question.optionE ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D"];

  const getOptionText = (q: Question, key: AnswerKey): string => {
    const map: Record<AnswerKey, string | null | undefined> = {
      A: q.optionA,
      B: q.optionB,
      C: q.optionC,
      D: q.optionD,
      E: q.optionE
    };
    return map[key] ?? "";
  };

  const isImageOption = (text: string): boolean => {
    return text.startsWith("/assets/") || text.startsWith("http");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <section className="rounded-2xl border border-border bg-white p-5 shadow-subtle">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <p className="text-sm font-semibold text-stone-700">Soal {active + 1} dari {questions.length}</p>
          <p className="text-sm text-muted">Timer: {remaining}</p>
        </div>

        {/* Question text */}
        <p className="text-base font-semibold leading-7 text-stone-950">{formatMath(question.questionText)}</p>

        {/* Question image */}
        {question.questionImage && (
          <img
            src={question.questionImage}
            alt={question.imageAlt ?? `Gambar soal nomor ${question.questionNumber ?? active + 1}`}
            className="mx-auto my-4 block max-w-lg rounded-md border border-gray-200"
            onError={(e) => {
              const el = e.currentTarget;
              const fallback = document.createElement("p");
              fallback.textContent = "[Gambar soal tidak dapat ditampilkan]";
              fallback.className = "text-sm text-red-500 italic my-2";
              el.parentNode?.replaceChild(fallback, el);
            }}
          />
        )}

        {/* Options */}
        <div className="mt-5 space-y-3">
          {options.map((option) => (
            <label key={option} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-sm transition hover:border-red-200 hover:bg-red-50">
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === option}
                onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
              />
              <span>
                {option}. {isImageOption(getOptionText(question, option))
                  ? <img src={getOptionText(question, option)} alt={`Opsi ${option}`} className="mt-1 max-h-24 rounded border" />
                  : formatMath(getOptionText(question, option))
                }
              </span>
            </label>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50" disabled={active === 0} onClick={() => setActive((value) => value - 1)}>Sebelumnya</button>
          <button type="button" className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50" disabled={active === questions.length - 1} onClick={() => setActive((value) => value + 1)}>Selanjutnya</button>
          <button
            type="button"
            className="ml-auto rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong"
            onClick={async () => {
              setError("");
              const response = await fetch(submitEndpoint, { method: "POST", body: JSON.stringify({ answers }) });
              const data = await response.json();
              if (!response.ok) {
                setError(data.error ?? "Gagal mengirim tes.");
                return;
              }
              router.push(resultPath);
              router.refresh();
            }}
          >
            Submit
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-error">{error}</p>}
      </section>

      {/* Question navigation sidebar */}
      <aside className="rounded-2xl border border-border bg-white p-4 shadow-subtle">
        <p className="mb-3 text-sm font-semibold text-stone-700">Navigasi Soal</p>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={`h-9 rounded-xl border text-sm font-semibold transition ${answers[item.id] ? "border-red-200 bg-red-50 text-primary" : "border-border bg-white text-stone-700 hover:border-red-200 hover:bg-red-50"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

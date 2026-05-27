"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formatMath } from "@/lib/math-format";
import { lkmSubmissionSchema, learningFeedbackSchema, peerAssessmentSchema } from "@/lib/validations";

export function LkmSubmissionForm({ number }: { number: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof lkmSubmissionSchema>>({ resolver: zodResolver(lkmSubmissionSchema) });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const response = await fetch(`/api/student/lkm/${number}/submit`, { method: "POST", body: JSON.stringify(values) });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error ?? "Gagal mengirim LKM.");
          return;
        }
        router.push(`/mahasiswa/lkm/${number}/result`);
        router.refresh();
      })}
    >
      <label className="block">
        <span className="text-sm font-semibold text-stone-700">Jawaban</span>
        <textarea className="form-input mt-1 min-h-44" {...form.register("answerText")} />
        {form.formState.errors.answerText && <span className="mt-1 block text-xs text-error">{form.formState.errors.answerText.message}</span>}
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-stone-700">URL File Pendukung (opsional)</span>
        <input className="form-input mt-1" {...form.register("uploadedFileUrl")} />
        {form.formState.errors.uploadedFileUrl && <span className="mt-1 block text-xs text-error">{form.formState.errors.uploadedFileUrl.message}</span>}
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex gap-2">
        <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Submit LKM</button>
      </div>
    </form>
  );
}

type LkmSection = {
  phase: string;
  title: string;
  content: string;
  activity: string;
  answerPrompt: string;
};

export function LkmCpaForm({ number, sections, reflectionPrompt, existingAnswer }: {
  number: number;
  sections: LkmSection[];
  reflectionPrompt: string;
  existingAnswer: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Parse existing answer if JSON
  let initialAnswers: Record<string, string> = {};
  try {
    if (existingAnswer) initialAnswers = JSON.parse(existingAnswer);
  } catch {
    // plain text fallback
  }

  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  const handleSubmit = async (isDraft: boolean) => {
    setError("");
    setSubmitting(true);
    const answerText = JSON.stringify(answers);
    if (!isDraft && answerText.length < 20) {
      setError("Jawaban LKM minimal 20 karakter.");
      setSubmitting(false);
      return;
    }
    const response = await fetch(`/api/student/lkm/${number}/submit`, {
      method: "POST",
      body: JSON.stringify({ answerText, uploadedFileUrl: "" })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Gagal mengirim LKM.");
      setSubmitting(false);
      return;
    }
    if (isDraft) {
      setSubmitting(false);
      return;
    }
    router.push(`/mahasiswa/lkm/${number}/feedback`);
    router.refresh();
  };

  const phaseColors: Record<string, string> = {
    Concrete: "border-blue-200 bg-blue-50",
    Pictorial: "border-purple-200 bg-purple-50",
    Abstract: "border-green-200 bg-green-50"
  };

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <section key={section.phase} className={`rounded-2xl border p-5 ${phaseColors[section.phase] ?? "border-border bg-white"}`}>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex rounded-full border border-stone-300 bg-white px-2.5 py-0.5 text-xs font-bold text-stone-700">
              {section.phase}
            </span>
            <h3 className="text-sm font-semibold text-stone-800">{section.title}</h3>
          </div>
          <p className="text-sm text-stone-600">{formatMath(section.content)}</p>
          <div className="mt-3 rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-700">
            <p className="font-medium">Aktivitas:</p>
            <p className="mt-1">{formatMath(section.activity)}</p>
          </div>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-stone-700">{section.answerPrompt}</span>
            <textarea
              className="form-input mt-1 min-h-32"
              value={answers[`section_${index}`] ?? ""}
              onChange={(e) => setAnswers({ ...answers, [`section_${index}`]: e.target.value })}
              placeholder="Tuliskan jawaban Anda di sini..."
            />
          </label>
        </section>
      ))}

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleSubmit(false)}
          className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong disabled:opacity-50"
        >
          Submit LKM
        </button>
      </div>
    </div>
  );
}

export function PeerAssessmentForm({ number }: { number: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof peerAssessmentSchema>>({ resolver: zodResolver(peerAssessmentSchema) });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const response = await fetch(`/api/student/lkm/${number}/peer-assessment`, { method: "POST", body: JSON.stringify(values) });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error ?? "Gagal menyimpan penilaian sejawat.");
          return;
        }
        router.push(`/mahasiswa/lkm/${number}/feedback`);
        router.refresh();
      })}
    >
      <label className="block">
        <span className="text-sm font-semibold text-stone-700">Nama Teman</span>
        <input className="form-input mt-1" {...form.register("assessedFriendName")} />
      </label>
      {(["contributionScore", "communicationScore", "responsibilityScore", "collaborationScore"] as const).map((field) => (
        <label key={field} className="block">
          <span className="text-sm font-semibold capitalize text-stone-700">{field.replace("Score", "")}</span>
          <select className="form-input mt-1" {...form.register(field)}>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      ))}
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex gap-2">
        <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Simpan Penilaian</button>
        <button
          type="button"
          className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50"
          onClick={async () => {
            await fetch(`/api/student/lkm/${number}/skip-peer`, { method: "POST" });
            router.push(`/mahasiswa/lkm/${number}/feedback`);
          }}
        >
          Skip
        </button>
      </div>
    </form>
  );
}

export function LearningFeedbackForm({ number }: { number: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof learningFeedbackSchema>>({ resolver: zodResolver(learningFeedbackSchema) });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const response = await fetch(`/api/student/lkm/${number}/feedback`, { method: "POST", body: JSON.stringify(values) });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error ?? "Gagal menyimpan feedback.");
          return;
        }
        router.push(`/mahasiswa/lkm/${number}/result`);
        router.refresh();
      })}
    >
      <label className="block">
        <span className="text-sm font-semibold text-stone-700">Refleksi / Pengalaman Belajar</span>
        <p className="mt-1 text-xs text-muted">Ceritakan pengalaman belajar Anda pada LKM ini. Minimal 20 karakter.</p>
        <textarea className="form-input mt-2 min-h-40" placeholder="Ceritakan pengalaman belajar Anda..." {...form.register("reflectionText")} />
        {form.formState.errors.reflectionText && <span className="mt-1 block text-xs text-error">{form.formState.errors.reflectionText.message}</span>}
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-stone-700">Penilaian LKM ini</span>
        <p className="mt-1 text-xs text-muted">Seberapa membantu LKM ini untuk pemahaman Anda?</p>
        <select className="form-input mt-2" defaultValue={4} {...form.register("rating")}>
          <option value={5}>5 — Sangat membantu</option>
          <option value={4}>4 — Membantu</option>
          <option value={3}>3 — Cukup</option>
          <option value={2}>2 — Kurang membantu</option>
          <option value={1}>1 — Tidak membantu</option>
        </select>
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      <button className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Submit Refleksi</button>
    </form>
  );
}


// ─── LKM Content Form (renders full LKM items from lkm-content.ts) ─────────────

import type { LKMContent, LKMItem, LKMSection } from "@/lib/lkm-content";

export function LkmContentForm({ number, content, existingAnswer }: {
  number: number;
  content: LKMContent;
  existingAnswer: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Parse existing answers
  let initialAnswers: Record<string, string> = {};
  try {
    if (existingAnswer) initialAnswers = JSON.parse(existingAnswer);
  } catch {
    // fallback
  }

  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  // Collect all answerable item IDs
  const answerableItems = content.sections.flatMap((s) =>
    s.items.filter((item) => item.type === "prompt" || item.type === "question" || item.type === "answer_area" || item.type === "table")
  );

  const handleSubmit = async (isDraft: boolean) => {
    setError("");
    setSubmitting(true);
    const answerText = JSON.stringify(answers);
    if (!isDraft && Object.values(answers).filter((v) => v.trim().length > 0).length < 1) {
      setError("Isi minimal satu jawaban sebelum submit.");
      setSubmitting(false);
      return;
    }
    const response = await fetch(`/api/student/lkm/${number}/submit`, {
      method: "POST",
      body: JSON.stringify({ answerText, uploadedFileUrl: "" })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Gagal mengirim LKM.");
      setSubmitting(false);
      return;
    }
    if (isDraft) {
      setSubmitting(false);
      return;
    }
    router.push(`/mahasiswa/lkm/${number}/feedback`);
    router.refresh();
  };

  const phaseColors: Record<string, string> = {
    Concrete: "border-blue-200 bg-blue-50/50",
    Pictorial: "border-purple-200 bg-purple-50/50",
    Abstract: "border-green-200 bg-green-50/50",
    PR: "border-amber-200 bg-amber-50/50",
    General: "border-border bg-white"
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-2xl border border-border bg-white p-4 text-sm text-muted">
        <p className="font-semibold text-stone-800">Petunjuk:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {content.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
        </ul>
      </div>

      {/* Sections */}
      {content.sections.map((section) => (
        <LkmSectionRenderer
          key={section.id}
          section={section}
          phaseColor={phaseColors[section.phase] ?? phaseColors.General}
          answers={answers}
          setAnswers={setAnswers}
        />
      ))}

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleSubmit(false)}
          className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong disabled:opacity-50"
        >
          Submit LKM
        </button>
      </div>
    </div>
  );
}

function LkmSectionRenderer({ section, phaseColor, answers, setAnswers }: {
  section: LKMSection;
  phaseColor: string;
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
}) {
  return (
    <section className={`rounded-2xl border p-5 ${phaseColor}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex rounded-full border border-stone-300 bg-white px-2.5 py-0.5 text-xs font-bold text-stone-700">
          {section.phase}
        </span>
        <h3 className="text-sm font-semibold text-stone-800">{section.title}</h3>
      </div>
      <div className="space-y-4">
        {section.items.map((item) => (
          <LkmItemRenderer
            key={item.id}
            item={item}
            value={answers[item.id] ?? ""}
            onChange={(val) => setAnswers({ ...answers, [item.id]: val })}
          />
        ))}
      </div>
    </section>
  );
}

function LkmItemRenderer({ item, value, onChange }: {
  item: LKMItem;
  value: string;
  onChange: (val: string) => void;
}) {
  switch (item.type) {
    case "note":
      return (
        <div className="rounded-lg border border-stone-200 bg-white p-3 text-sm">
          <p className="font-semibold text-stone-800">{formatMath(item.content)}</p>
        </div>
      );

    case "image":
      return (
        <div className="my-3">
          {item.imageSrc ? (
            <img
              src={item.imageSrc}
              alt={item.imageAlt ?? item.content}
              className="mx-auto block max-w-lg rounded-md border border-gray-200"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const placeholder = document.createElement("div");
                placeholder.className = "rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-center text-sm text-amber-700";
                placeholder.textContent = `[Gambar: ${item.imageAlt ?? item.content ?? "tidak dapat ditampilkan"}]`;
                el.parentNode?.appendChild(placeholder);
              }}
            />
          ) : (
            <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 text-center text-sm text-muted">
              {item.imageAlt ?? item.content ?? "[Gambar belum tersedia]"}
            </div>
          )}
          {item.content && <p className="mt-1 text-center text-xs text-muted italic">{item.content}</p>}
        </div>
      );

    case "prompt":
    case "question":
      return (
        <div className="space-y-2">
          <p className="text-sm text-stone-700"><span className="font-semibold text-primary">P:</span> {formatMath(item.content)}</p>
          {item.imageSrc && (
            <img
              src={item.imageSrc}
              alt={item.imageAlt ?? "Gambar soal"}
              className="mx-auto my-2 block max-w-md rounded-md border border-gray-200"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
          <textarea
            className="form-input min-h-24 text-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tuliskan jawaban Anda..."
          />
        </div>
      );

    case "table":
      return (
        <div className="space-y-2">
          <p className="text-sm text-stone-700">{formatMath(item.content)}</p>
          {item.imageSrc && (
            <img
              src={item.imageSrc}
              alt={item.imageAlt ?? "Gambar tabel"}
              className="mx-auto my-2 block max-w-md rounded-md border border-gray-200"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
          {item.tableHeaders && item.tableHeaders.length > 0 ? (
            <TableInput
              headers={item.tableHeaders}
              rows={item.tableRows ?? 5}
              value={value}
              onChange={onChange}
            />
          ) : (
            <textarea
              className="form-input min-h-20 text-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Isi tabel atau jawaban Anda di sini..."
            />
          )}
        </div>
      );

    case "answer_area":
      return (
        <textarea
          className="form-input min-h-20 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Jawaban Anda..."
        />
      );

    default:
      return <p className="text-sm text-muted">{formatMath(item.content)}</p>;
  }
}


function TableInput({ headers, rows, value, onChange }: {
  headers: string[];
  rows: number;
  value: string;
  onChange: (val: string) => void;
}) {
  // Parse existing value as 2D array
  let tableData: string[][] = [];
  try {
    if (value) tableData = JSON.parse(value);
  } catch {
    // fallback
  }
  // Ensure correct dimensions
  if (!Array.isArray(tableData) || tableData.length === 0) {
    tableData = Array.from({ length: rows }, () => Array(headers.length).fill(""));
  }

  const updateCell = (rowIdx: number, colIdx: number, cellValue: string) => {
    const newData = tableData.map((row, ri) =>
      ri === rowIdx ? row.map((cell, ci) => (ci === colIdx ? cellValue : cell)) : [...row]
    );
    onChange(JSON.stringify(newData));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-stone-100">
          <tr>
            <th className="border-b border-r px-2 py-1.5 text-center text-xs font-semibold text-stone-600 w-10">No</th>
            {headers.map((h, i) => (
              <th key={i} className="border-b border-r px-2 py-1.5 text-left text-xs font-semibold text-stone-600">
                {formatMath(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b last:border-b-0">
              <td className="border-r px-2 py-1 text-center text-xs text-muted">{rowIdx + 1}</td>
              {headers.map((_, colIdx) => (
                <td key={colIdx} className="border-r p-0.5">
                  <input
                    type="text"
                    className="w-full border-0 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={row[colIdx] ?? ""}
                    onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                    placeholder="..."
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

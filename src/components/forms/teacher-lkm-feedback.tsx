"use client";

import { useState } from "react";

type Props = {
  studentId: string;
  lkmId: string;
  lkmNumber: number;
  answerText: string;
  existingFeedback: string | null;
  status: string;
  studentReflection: string | null;
  studentRating: number | null;
};

export function TeacherLkmFeedbackPanel({ studentId, lkmId, lkmNumber, answerText, existingFeedback, status, studentReflection, studentRating }: Props) {
  const [feedbackText, setFeedbackText] = useState(existingFeedback ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Parse answer text
  let answers: Record<string, string> = {};
  try {
    answers = JSON.parse(answerText);
  } catch {
    answers = { plain: answerText };
  }

  const handleSave = async () => {
    if (!feedbackText.trim()) {
      setMessage("Feedback tidak boleh kosong.");
      return;
    }
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/teacher/lkm-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, lkmId, feedbackText: feedbackText.trim() })
    });
    const data = await response.json();
    if (response.ok) {
      setMessage(data.message ?? "Feedback berhasil disimpan.");
    } else {
      setMessage(data.error ?? "Gagal menyimpan feedback.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === "SUBMITTED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {status === "SUBMITTED" ? "Sudah Submit" : "Draft"}
        </span>
      </div>

      {/* Student answers */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Jawaban Mahasiswa:</p>
        {Object.entries(answers).map(([key, value]) => {
          if (!value) return null;
          const label = key === "plain"
            ? "Jawaban"
            : key === "reflection"
              ? "Refleksi"
              : `Section ${Number(key.replace("section_", "")) + 1}`;
          return (
            <div key={key} className="rounded-lg border border-border bg-stone-50 p-3 text-sm">
              <p className="font-medium text-stone-600">{label}:</p>
              <p className="mt-1 whitespace-pre-wrap text-stone-700">{value}</p>
            </div>
          );
        })}
      </div>

      {/* Student reflection & rating */}
      {(studentReflection || studentRating) && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-stone-800">Refleksi & Penilaian Mahasiswa:</p>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
            {studentRating && (
              <p className="font-medium text-amber-800">Rating: {studentRating}/5 {studentRating >= 4 ? "— Membantu" : studentRating >= 3 ? "— Cukup" : "— Kurang membantu"}</p>
            )}
            {studentReflection && (
              <p className="mt-2 whitespace-pre-wrap text-amber-900">{studentReflection}</p>
            )}
          </div>
        </div>
      )}

      {/* Feedback form */}
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            {existingFeedback ? "Perbarui Feedback:" : "Berikan Feedback:"}
          </span>
          <textarea
            className="form-input mt-1 min-h-28"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tuliskan feedback kualitatif untuk mahasiswa..."
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong disabled:opacity-50"
          >
            {existingFeedback ? "Perbarui Feedback" : "Simpan Feedback"}
          </button>
          {message && (
            <span className="text-sm text-green-700">{message}</span>
          )}
        </div>
      </div>
    </div>
  );
}

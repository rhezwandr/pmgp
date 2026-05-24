"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TeacherNoteForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch(`/api/teacher/students/${studentId}/notes`, {
          method: "POST",
          body: JSON.stringify({ noteText })
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error ?? "Gagal menyimpan catatan.");
          return;
        }
        setNoteText("");
        router.refresh();
      }}
    >
      <textarea className="form-input min-h-24" value={noteText} onChange={(event) => setNoteText(event.target.value)} />
      {error && <p className="text-sm text-error">{error}</p>}
      <button className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong">Simpan Catatan</button>
    </form>
  );
}

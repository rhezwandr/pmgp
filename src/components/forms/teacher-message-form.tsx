"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { jsonFetchHeaders, readJsonResponse } from "@/lib/http-client";

export function TeacherMessageForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        const response = await fetch(`/api/teacher/students/${studentId}/messages`, {
          method: "POST",
          headers: jsonFetchHeaders,
          body: JSON.stringify({ title, content })
        });
        const data = await readJsonResponse<{ error?: string }>(response, "Pesan gagal dikirim.");
        setLoading(false);
        if (!response.ok) {
          setError(data.error ?? "Pesan gagal dikirim.");
          return;
        }
        setTitle("");
        setContent("");
        setSuccess("Pesan berhasil dikirim ke mahasiswa.");
        router.refresh();
      }}
    >
      <input className="form-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Judul pesan" />
      <textarea className="form-input min-h-28" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Tulis pesan, arahan, atau catatan tindak lanjut untuk mahasiswa." />
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
      {success && <p className="rounded-2xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
      <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong disabled:opacity-60" disabled={loading}>
        <Send className="h-4 w-4" />
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}

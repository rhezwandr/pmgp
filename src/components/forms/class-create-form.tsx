"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { jsonFetchHeaders, readJsonResponse } from "@/lib/http-client";

export function ClassCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("Genap");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="grid gap-3 lg:grid-cols-[1fr_140px_160px_auto]"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        const response = await fetch("/api/teacher/classes/create", {
          method: "POST",
          headers: jsonFetchHeaders,
          body: JSON.stringify({ name, semester, academicYear })
        });
        const data = await readJsonResponse<{ error?: string }>(response, "Kelas gagal dibuat.");
        setLoading(false);
        if (!response.ok) {
          setError(data.error ?? "Kelas gagal dibuat.");
          return;
        }
        setName("");
        router.refresh();
      }}
    >
      <input className="form-input" placeholder="Nama kelas" value={name} onChange={(event) => setName(event.target.value)} />
      <input className="form-input" placeholder="Semester" value={semester} onChange={(event) => setSemester(event.target.value)} />
      <input className="form-input" placeholder="Tahun akademik" value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} />
      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong disabled:opacity-60" disabled={loading}>
        <Plus className="h-4 w-4" />
        {loading ? "Membuat..." : "Buat Kelas"}
      </button>
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-error lg:col-span-4">{error}</p>}
    </form>
  );
}

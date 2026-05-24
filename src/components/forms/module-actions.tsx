"use client";

import { BookOpenCheck, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { jsonFetchHeaders, readJsonResponse } from "@/lib/http-client";
import type { ModuleSection } from "@/lib/module-learning";

type ModuleStudyPanelProps = {
  moduleId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  sections: ModuleSection[];
  readProgress: number;
  readSectionCount: number;
  requiredSectionCount: number;
  reflectionText: string;
};

export function ModuleStudyPanel({
  moduleId,
  status,
  sections,
  readProgress,
  readSectionCount,
  requiredSectionCount,
  reflectionText
}: ModuleStudyPanelProps) {
  const router = useRouter();
  const [localReadCount, setLocalReadCount] = useState(readSectionCount);
  const [localProgress, setLocalProgress] = useState(readProgress);
  const [reflection, setReflection] = useState(reflectionText);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState<"open" | "progress" | "complete" | null>(null);

  const isStarted = status !== "NOT_STARTED" || localProgress > 0;
  const isCompleted = status === "COMPLETED";
  const nextSectionIndex = Math.min(localReadCount, sections.length - 1);
  const completionReady = localProgress >= 100 && reflection.trim().length >= 30 && /[\p{L}\p{N}]/u.test(reflection);

  const sectionLabel = useMemo(() => {
    if (isCompleted) return "Semua bagian sudah dipelajari.";
    if (!isStarted) return "Mulai modul untuk membuka progres membaca.";
    return localReadCount >= requiredSectionCount
      ? "Semua bagian wajib sudah dibaca. Isi refleksi untuk menyelesaikan modul."
      : `Lanjutkan ke bagian ${localReadCount + 1} dari ${requiredSectionCount}.`;
  }, [isCompleted, isStarted, localReadCount, requiredSectionCount]);

  async function post(endpoint: string, body?: Record<string, unknown>) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: jsonFetchHeaders,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await readJsonResponse<{ error?: string; readProgress?: number; readSectionCount?: number }>(
      response,
      "Server tidak mengirim respons JSON."
    );
    if (!response.ok) throw new Error(data.error ?? "Aksi modul gagal.");
    return data;
  }

  async function handleOpen() {
    setLoadingAction("open");
    setError("");
    try {
      await post(`/api/student/modules/${moduleId}/open`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Modul gagal dibuka.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleReadNext() {
    setLoadingAction("progress");
    setError("");
    const nextCount = Math.min(requiredSectionCount, localReadCount + 1);
    try {
      const data = await post(`/api/student/modules/${moduleId}/progress`, { readSectionCount: nextCount });
      setLocalReadCount(data.readSectionCount ?? nextCount);
      setLocalProgress(data.readProgress ?? Math.round((nextCount / requiredSectionCount) * 100));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Progress modul gagal disimpan.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleComplete() {
    setLoadingAction("complete");
    setError("");
    try {
      await post(`/api/student/modules/${moduleId}/complete`, { reflectionText: reflection });
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Modul belum dapat diselesaikan.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-red-900">
          <span>Progres membaca</span>
          <span>{localProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${localProgress}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">{sectionLabel}</p>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => {
          const read = index < localReadCount;
          const active = isStarted && index === nextSectionIndex && !read;
          return (
            <div
              key={`${section.title}-${index}`}
              className={`rounded-2xl border p-3 text-sm ${
                read ? "border-green-200 bg-green-50" : active ? "border-red-200 bg-white" : "border-border bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-950">{index + 1}. {section.title}</p>
                  <p className="mt-1 text-muted">{section.content}</p>
                </div>
                {read && <CheckCircle className="h-4 w-4 shrink-0 text-success" />}
              </div>
            </div>
          );
        })}
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-stone-800">Refleksi singkat setelah membaca</span>
        <textarea
          className="form-input mt-2 min-h-24"
          value={reflection}
          disabled={isCompleted}
          placeholder="Tuliskan konsep apa yang sudah dipahami dan bagian mana yang masih perlu diulang."
          onChange={(event) => setReflection(event.target.value)}
        />
        <span className="mt-1.5 block text-xs text-muted">Minimal 30 karakter dan harus berisi kalimat bermakna.</span>
      </label>

      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-error">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {!isStarted && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong disabled:opacity-60"
            disabled={loadingAction !== null}
            onClick={handleOpen}
          >
            {loadingAction === "open" ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpenCheck className="h-4 w-4" />}
            Mulai Pelajari Modul
          </button>
        )}
        {isStarted && !isCompleted && (
          <button
            type="button"
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-60"
            disabled={loadingAction !== null || localReadCount >= requiredSectionCount}
            onClick={handleReadNext}
          >
            {loadingAction === "progress" ? "Menyimpan..." : "Tandai Bagian Ini Sudah Dibaca"}
          </button>
        )}
        <button
          type="button"
          className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/20 transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isCompleted || loadingAction !== null || !completionReady}
          onClick={handleComplete}
        >
          {loadingAction === "complete" ? "Menyelesaikan..." : isCompleted ? "Modul Selesai" : "Selesaikan Modul"}
        </button>
      </div>
    </div>
  );
}

export function ModuleReflectionForm({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = reflection.trim().length >= 20 && /[\p{L}\p{N}]/u.test(reflection);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      // First open the module
      await fetch(`/api/student/modules/${moduleId}/open`, { method: "POST", headers: jsonFetchHeaders });
      // Set progress to 100%
      await fetch(`/api/student/modules/${moduleId}/progress`, {
        method: "POST",
        headers: jsonFetchHeaders,
        body: JSON.stringify({ readSectionCount: 3 })
      });
      // Complete with reflection
      const response = await fetch(`/api/student/modules/${moduleId}/complete`, {
        method: "POST",
        headers: jsonFetchHeaders,
        body: JSON.stringify({ reflectionText: reflection })
      });
      const data = await readJsonResponse<{ error?: string }>(response, "Gagal menyelesaikan modul.");
      if (!response.ok) throw new Error(data.error ?? "Gagal menyelesaikan modul.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal menyelesaikan modul.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Setelah membaca modul PDF di atas, tuliskan refleksi tentang apa yang Anda pelajari dan pahami. Minimal 20 karakter.
      </p>
      <textarea
        className="form-input min-h-32"
        value={reflection}
        placeholder="Tuliskan apa yang Anda pelajari dan pahami dari modul ini..."
        onChange={(e) => setReflection(e.target.value)}
      />
      <p className="text-xs text-muted">{reflection.trim().length}/20 karakter minimum</p>
      {error && <p className="text-sm text-error">{error}</p>}
      <button
        type="button"
        disabled={!canSubmit || loading}
        onClick={handleSubmit}
        className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Selesai Mempelajari Modul"}
      </button>
    </div>
  );
}

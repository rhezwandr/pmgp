"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  lkmNumber: number;
};

/**
 * LKM Security Wrapper
 * - Blocks copy/cut/right-click on QUESTION areas only (not answer textareas)
 * - Allows paste/copy/cut in answer textareas
 * - Does NOT detect tab leave (LKM is learning activity, not strict exam)
 * - Does NOT auto-submit or lock answers
 */
export function LkmSecurityWrapper({ children, lkmNumber }: Props) {
  const [message, setMessage] = useState("");

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  const logActivity = useCallback((type: string, description: string) => {
    fetch("/api/student/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType: type, description })
    }).catch(() => {});
  }, []);

  useEffect(() => {
    // Copy on question areas only
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable) return;
      e.preventDefault();
      logActivity("LKM_QUESTION_COPY_ATTEMPT", `Mahasiswa mencoba menyalin pertanyaan LKM ${lkmNumber}.`);
      showMessage("Menyalin pertanyaan LKM tidak diperbolehkan.");
    };

    // Cut on question areas only
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable) return;
      e.preventDefault();
      logActivity("LKM_QUESTION_CUT_ATTEMPT", `Mahasiswa mencoba cut pertanyaan LKM ${lkmNumber}.`);
      showMessage("Menyalin pertanyaan LKM tidak diperbolehkan.");
    };

    // Right-click on question areas only
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable) return;
      if (target.closest("[data-answer-area]")) return;
      e.preventDefault();
      logActivity("LKM_QUESTION_RIGHT_CLICK_ATTEMPT", `Klik kanan pada pertanyaan LKM ${lkmNumber}.`);
      showMessage("Menyalin pertanyaan LKM tidak diperbolehkan.");
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [lkmNumber, logActivity, showMessage]);

  return (
    <div>
      {/* Info banner */}
      <div className="mb-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 text-xs text-muted">
        📝 Pertanyaan LKM tidak dapat disalin. Anda tetap dapat menulis atau menempel jawaban pada kolom jawaban.
      </div>

      {/* Toast message */}
      {message && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 shadow-lg">
          {message}
        </div>
      )}

      {/* Question areas get select-none, answer areas remain normal */}
      <div className="lkm-question-area select-none [&_textarea]:select-auto [&_input]:select-auto [&_[data-answer-area]]:select-auto">
        {children}
      </div>
    </div>
  );
}

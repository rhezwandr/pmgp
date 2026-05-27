"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SecurityEvent = {
  type: "TAB_BLUR" | "TAB_HIDDEN" | "COPY_ATTEMPT" | "PASTE_ATTEMPT" | "RIGHT_CLICK" | "FULLSCREEN_EXIT";
  timestamp: number;
};

type Props = {
  children: React.ReactNode;
  testType: string;
  onSecurityEvent?: (event: SecurityEvent) => void;
};

export function TestSecurityWrapper({ children, testType, onSecurityEvent }: Props) {
  const [warnings, setWarnings] = useState(0);
  const [message, setMessage] = useState("");
  const eventsRef = useRef<SecurityEvent[]>([]);

  const logEvent = useCallback((type: SecurityEvent["type"]) => {
    const event: SecurityEvent = { type, timestamp: Date.now() };
    eventsRef.current.push(event);
    setWarnings((w) => w + 1);
    onSecurityEvent?.(event);

    // Send to backend (fire and forget)
    fetch("/api/student/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType: `SECURITY_${type}`, description: `${testType}: ${type}` })
    }).catch(() => {});
  }, [testType, onSecurityEvent]);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  useEffect(() => {
    // Tab visibility change
    const handleVisibility = () => {
      if (document.hidden) {
        logEvent("TAB_HIDDEN");
        showMessage("Anda meninggalkan halaman ujian. Aktivitas ini dicatat oleh sistem.");
      }
    };

    // Window blur
    const handleBlur = () => {
      logEvent("TAB_BLUR");
      showMessage("Anda meninggalkan halaman ujian. Aktivitas ini dicatat oleh sistem.");
    };

    // Copy/Paste/Cut
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent("COPY_ATTEMPT");
      showMessage("Menyalin teks tidak diperbolehkan selama pengerjaan.");
    };
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent("PASTE_ATTEMPT");
      showMessage("Menempel teks tidak diperbolehkan selama pengerjaan.");
    };
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent("COPY_ATTEMPT");
      showMessage("Menyalin teks tidak diperbolehkan selama pengerjaan.");
    };

    // Right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logEvent("RIGHT_CLICK");
      showMessage("Klik kanan tidak diperbolehkan selama pengerjaan.");
    };

    // Fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logEvent("FULLSCREEN_EXIT");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [logEvent, showMessage]);

  return (
    <div className="select-none" onSelectCapture={(e) => e.preventDefault()}>
      {/* Security info banner */}
      <div className="mb-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 text-xs text-muted">
        🔒 Selama pengerjaan, sistem mencatat aktivitas keluar tab, copy-paste, dan perpindahan halaman.
      </div>

      {/* Warning counter */}
      {warnings > 0 && (
        <div className={`mb-4 rounded-lg border px-4 py-2 text-sm font-medium ${warnings >= 3 ? "border-red-300 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
          ⚠️ Peringatan: Anda telah melakukan {warnings} aktivitas mencurigakan.
          {warnings >= 3 && " Aktivitas ini akan dilaporkan ke dosen."}
        </div>
      )}

      {/* Toast message */}
      {message && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-lg">
          {message}
        </div>
      )}

      {children}
    </div>
  );
}

/**
 * Button to enter fullscreen mode before starting test.
 */
export function FullscreenButton() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(!!document.documentElement.requestFullscreen);
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }}
      className="mb-4 inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
    >
      🖥️ Mulai dalam Mode Fokus (Fullscreen)
    </button>
  );
}

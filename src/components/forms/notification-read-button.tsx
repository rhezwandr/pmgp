"use client";

import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NotificationReadButton({ notificationId, disabled }: { notificationId: string; disabled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled || loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/student/notifications/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId }),
        });
        router.refresh();
        setLoading(false);
      }}
    >
      <CheckCheck className="h-3.5 w-3.5 text-primary" />
      {disabled ? "Sudah dibaca" : loading ? "..." : "Tandai dibaca"}
    </button>
  );
}

export function MarkAllReadButton({ hasUnread }: { hasUnread: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!hasUnread) return null;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/student/notifications/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        router.refresh();
        setLoading(false);
      }}
    >
      <CheckCheck className="h-4 w-4 text-primary" />
      {loading ? "Menandai..." : "Tandai semua dibaca"}
    </button>
  );
}

"use client";

import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MessageReadButton({ messageId, disabled }: { messageId: string; disabled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled || loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/student/messages/${messageId}/read`, { method: "POST" });
        router.refresh();
        setLoading(false);
      }}
    >
      <CheckCheck className="h-4 w-4 text-primary" />
      {disabled ? "Sudah dibaca" : loading ? "Menandai..." : "Tandai dibaca"}
    </button>
  );
}

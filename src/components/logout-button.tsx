"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-primary focus:outline-none focus:ring-4 focus:ring-red-100"
    >
      <LogOut className="h-4 w-4" />
      {compact ? "Keluar" : "Logout"}
    </button>
  );
}

import { BookOpen, ClipboardList, FileText, Home, Layers, LineChart, Lock, Settings, Users } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { BrandHeader } from "@/components/brand";
import { APP_NAME } from "@/lib/constants";
import type { StudentLearningAccess } from "@/lib/learning-access";

import { LogoutButton } from "../logout-button";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  locked?: boolean;
  badge?: number;
};

function Sidebar({ items, userName }: { items: NavItem[]; userName: string }) {
  return (
    <aside className="border-b border-border bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-5 py-5">
          <BrandHeader />
          <p className="mt-1 text-xs text-muted">{userName}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.locked ? "#" : item.href}
              aria-disabled={item.locked}
              className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                item.locked ? "cursor-not-allowed text-locked" : "text-stone-700 hover:bg-red-50 hover:text-primary"
              }`}
            >
              <span className={item.locked ? "text-locked" : "text-primary"}>{item.locked ? <Lock className="h-4 w-4" /> : item.icon}</span>
              <span>{item.label}</span>
              {item.badge ? <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-border p-3 lg:block">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

export async function StudentShell({
  children,
  userName,
  access,
  unreadMessageCount = 0
}: {
  children: ReactNode;
  userName: string;
  access: StudentLearningAccess;
  unreadMessageCount?: number;
}) {
  const items: NavItem[] = [
    { href: "/mahasiswa/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" />, locked: !access.canAccessDashboard },
    { href: "/mahasiswa/tes-kam", label: "Tes KAM", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/mahasiswa/pre-test", label: "Pre Test", icon: <FileText className="h-4 w-4" />, locked: !access.canAccessPreTest },
    { href: "/mahasiswa/modul", label: "Modul Ajar", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/mahasiswa/lkm", label: "LKM", icon: <Layers className="h-4 w-4" />, locked: !access.canAccessLKM1 },
    { href: "/mahasiswa/post-test", label: "Post Test", icon: <LineChart className="h-4 w-4" />, locked: !access.canAccessPostTest },
    { href: "/mahasiswa/notifikasi", label: "Notifikasi", icon: <FileText className="h-4 w-4" />, badge: unreadMessageCount }
  ];

  return <Shell items={items} userName={userName}>{children}</Shell>;
}

export function TeacherShell({ children, userName }: { children: ReactNode; userName: string }) {
  const items: NavItem[] = [
    { href: "/guru/dashboard", label: "Dashboard Guru", icon: <Home className="h-4 w-4" /> },
    { href: "/guru/kelas", label: "Kelas Saya", icon: <Users className="h-4 w-4" /> },
    { href: "/guru/rekap", label: "Rekap Nilai", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/guru/progress", label: "Progress Mahasiswa", icon: <LineChart className="h-4 w-4" /> },
    { href: "/guru/feedback", label: "Feedback & Sejawat", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/guru/lkm-feedback", label: "Feedback LKM", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/guru/security-log", label: "Log Keamanan", icon: <Lock className="h-4 w-4" /> },
    { href: "/guru/laporan", label: "Laporan Pembelajaran", icon: <FileText className="h-4 w-4" /> },
    { href: "/guru/pengaturan", label: "Pengaturan", icon: <Settings className="h-4 w-4" /> }
  ];
  return <Shell items={items} userName={userName}>{children}</Shell>;
}

async function Shell({ children, items, userName }: { children: ReactNode; items: NavItem[]; userName: string }) {
  const headersList = await headers();
  const path = headersList.get("x-pathname") ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar items={items} userName={userName} />
      <main className="px-4 py-6 lg:ml-64 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 shadow-calm lg:hidden">
            <span className="text-sm font-semibold text-stone-800">{path || APP_NAME}</span>
            <LogoutButton compact />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";

import { BrandHeader } from "@/components/brand";
import { LoginForm } from "@/components/forms/auth-forms";
import { getCurrentUser } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "TEACHER") redirect("/guru/dashboard");
  if (user?.role === "STUDENT") redirect("/mahasiswa/tes-kam");

  return (
    <main className="auth-screen px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-calm lg:grid-cols-[1fr_430px]">
        <div className="hidden border-r border-red-100 bg-red-50/30 p-10 lg:block">
          <BrandHeader compact />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-primary">KAM-LKM</p>
          <h1 className="mt-5 max-w-md text-4xl font-semibold tracking-tight text-stone-950">{APP_NAME}</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-muted">
            Platform akademik untuk mengelola Tes KAM, modul prasyarat, LKM berurutan, dan analitik pembelajaran matematika.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-stone-700">
            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-subtle">Alur mahasiswa terkunci otomatis sesuai progres.</div>
            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-subtle">Dosen memantau kelas melalui rekap dan laporan pembelajaran.</div>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">Selamat datang</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Masuk ke akun Anda</h2>
            <p className="mt-2 text-sm text-muted">Gunakan email dan password yang sudah terdaftar.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

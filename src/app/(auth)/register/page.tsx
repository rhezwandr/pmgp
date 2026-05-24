import { redirect } from "next/navigation";

import { BrandHeader } from "@/components/brand";
import { RegisterForm } from "@/components/forms/auth-forms";
import { getCurrentUser } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user?.role === "TEACHER") redirect("/guru/dashboard");
  if (user?.role === "STUDENT") redirect("/mahasiswa/tes-kam");

  return (
    <main className="auth-screen px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-calm lg:grid-cols-[1fr_520px]">
        <div className="bg-red-50/30 p-6 sm:p-10 lg:p-12">
          <BrandHeader compact />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Registrasi Akademik</p>
          <h1 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">{APP_NAME}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Dosen membuat kelas dan membagikan kode kelas. Mahasiswa cukup memasukkan kode tersebut saat register agar langsung terhubung ke kelas dan dosen yang benar.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-subtle">
              <p className="font-semibold text-stone-950">Untuk Mahasiswa</p>
              <p className="mt-1 text-sm text-muted">Gunakan Kode Kelas dari dosen untuk bergabung otomatis.</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-subtle">
              <p className="font-semibold text-stone-950">Untuk Dosen</p>
              <p className="mt-1 text-sm text-muted">Buat akun, masuk dashboard, lalu buat kelas dengan kode unik.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-red-100 p-6 sm:p-10 lg:border-l lg:border-t-0">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Buat akun baru</h2>
            <p className="mt-2 text-sm text-muted">Pilih role sebelum melanjutkan.</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}

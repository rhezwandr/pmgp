"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Loader2, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { jsonFetchHeaders, readJsonResponse } from "@/lib/http-client";
import { loginSchema, registerSchema } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(async (values) => {
        setError("");
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: jsonFetchHeaders,
          body: JSON.stringify(values)
        });
        const data = await readJsonResponse<{ redirectTo?: string; error?: string }>(response, "Login gagal. Server tidak mengirim respons JSON.");
        if (!response.ok) {
          setError(data.error ?? "Login gagal.");
          return;
        }
        if (!data.redirectTo) {
          setError("Login gagal. Respons server tidak lengkap.");
          return;
        }
        router.push(data.redirectTo);
        router.refresh();
      })}
    >
      <Field label="Email" error={form.formState.errors.email?.message}>
        <input className="auth-input" type="email" autoComplete="email" placeholder="nama@kampus.ac.id" {...form.register("email")} />
      </Field>
      <Field label="Password" error={form.formState.errors.password?.message}>
        <input className="auth-input" type="password" autoComplete="current-password" placeholder="Masukkan password" {...form.register("password")} />
      </Field>
      <ErrorMessage message={error} />
      <button className="auth-primary-button" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {form.formState.isSubmitting ? "Masuk..." : "Login"}
      </button>
      <p className="text-center text-sm text-muted">
        Belum punya akun? <Link className="font-semibold text-primary transition hover:text-primary-strong" href="/register">Register</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" }
  });
  const selectedRole = form.watch("role");

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(async (values) => {
        setError("");
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: jsonFetchHeaders,
          body: JSON.stringify(values)
        });
        const data = await readJsonResponse<{ redirectTo?: string; error?: string }>(response, "Register gagal. Server tidak mengirim respons JSON.");
        if (!response.ok) {
          setError(data.error ?? "Register gagal.");
          return;
        }
        if (!data.redirectTo) {
          setError("Register gagal. Respons server tidak lengkap.");
          return;
        }
        router.push(data.redirectTo);
        router.refresh();
      })}
    >
      <div>
        <span className="text-sm font-semibold text-stone-800">Daftar sebagai</span>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <RoleCard
            active={selectedRole === "STUDENT"}
            title="Mahasiswa"
            description="Masuk kelas dengan kode dosen"
            icon={<GraduationCap className="h-5 w-5" />}
            onClick={() => form.setValue("role", "STUDENT", { shouldValidate: true })}
          />
          <RoleCard
            active={selectedRole === "TEACHER"}
            title="Dosen"
            description="Kelola kelas dan kode kelas"
            icon={<UserRound className="h-5 w-5" />}
            onClick={() => form.setValue("role", "TEACHER", { shouldValidate: true })}
          />
        </div>
      </div>

      <Field label="Nama Lengkap" error={form.formState.errors.name?.message}>
        <input className="auth-input" autoComplete="name" placeholder="Nama lengkap" {...form.register("name")} />
      </Field>
      <Field label="Email" error={form.formState.errors.email?.message}>
        <input className="auth-input" type="email" autoComplete="email" placeholder="nama@kampus.ac.id" {...form.register("email")} />
      </Field>

      <div className={`grid gap-4 transition-all duration-300 ${selectedRole === "STUDENT" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden space-y-4">
          <Field label="NIM" error={form.formState.errors.nim?.message}>
            <input className="auth-input" placeholder="Contoh: 20260001" {...form.register("nim")} />
          </Field>
          <Field label="Kode Kelas" error={form.formState.errors.classCode?.message}>
            <input className="auth-input uppercase tracking-wide" placeholder="Contoh: KLS-CONTOH" {...form.register("classCode")} />
          </Field>
        </div>
      </div>

      <Field label="Password" error={form.formState.errors.password?.message}>
        <input className="auth-input" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" {...form.register("password")} />
      </Field>

      <ErrorMessage message={error} />
      <button className="auth-primary-button" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {form.formState.isSubmitting ? "Membuat akun..." : "Buat Akun"}
      </button>
      <p className="text-center text-sm text-muted">
        Sudah punya akun? <Link className="font-semibold text-primary transition hover:text-primary-strong" href="/login">Login</Link>
      </p>
    </form>
  );
}

function RoleCard({
  active,
  title,
  description,
  icon,
  onClick
}: {
  active: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition duration-200 focus:outline-none focus:ring-4 focus:ring-red-100 ${
        active ? "border-primary bg-primary text-white shadow-lg shadow-red-900/20" : "border-red-100 bg-white text-stone-700 hover:border-red-200 hover:bg-red-50"
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </span>
      <span className={`mt-1 block text-xs ${active ? "text-red-50" : "text-muted"}`}>{description}</span>
    </button>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-stone-800">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1.5 block text-xs font-medium text-error">{error}</span>}
    </label>
  );
}

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
      {message}
    </div>
  );
}

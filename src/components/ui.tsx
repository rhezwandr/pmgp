import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { clsx } from "clsx";

type CardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, description, action, children, className }: CardProps) {
  return (
    <section className={clsx("rounded-2xl border border-border bg-surface p-5 shadow-calm", className)}>
      {(title || description || action) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h2 className="text-base font-semibold text-stone-950">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function ButtonLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx(
        "inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-900/10 transition hover:border-primary-strong hover:bg-primary-strong focus:outline-none focus:ring-4 focus:ring-red-100",
        className
      )}
      {...props}
    />
  );
}

export function SecondaryLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx(
        "inline-flex items-center justify-center rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-primary focus:outline-none focus:ring-4 focus:ring-red-100",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "error" }) {
  const tones = {
    neutral: "border-red-100 bg-red-50 text-red-900",
    success: "border-green-200 bg-green-50 text-green-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    error: "border-red-200 bg-red-50 text-red-700"
  };
  return <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <div className="mb-3 h-1 w-10 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold tracking-normal text-stone-950">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ScoreCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-subtle">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-stone-950">{value ?? "-"}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/60 p-5 text-sm">
      <p className="font-semibold text-stone-950">{title}</p>
      <p className="mt-1 text-muted">{description}</p>
    </div>
  );
}

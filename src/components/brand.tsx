import { APP_NAME } from "@/lib/constants";

export function UpiLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return <img src="/logo-upi.png" alt="Logo Universitas Pendidikan Indonesia" className={className} />;
}

export function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-100 bg-white p-2 shadow-subtle">
        <UpiLogo className="max-h-9 w-auto object-contain" />
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-semibold text-stone-950">{APP_NAME}</p>
          <p className="text-xs text-muted">Universitas Pendidikan Indonesia</p>
        </div>
      )}
    </div>
  );
}

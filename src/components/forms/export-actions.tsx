"use client";

import { Download, FileText } from "lucide-react";

export function ExportActions({ excelHref, pdfHref }: { excelHref: string; pdfHref: string }) {
  function confirmExport(href: string, label: string) {
    if (window.confirm(`Export ${label} sesuai filter kelas yang dipilih?`)) {
      window.location.href = href;
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => confirmExport(excelHref, "Excel")}
        className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-900/10 transition hover:border-primary-strong hover:bg-primary-strong focus:outline-none focus:ring-4 focus:ring-red-100"
      >
        <Download className="mr-2 h-4 w-4" />
        Excel
      </button>
      <button
        type="button"
        onClick={() => confirmExport(pdfHref, "PDF")}
        className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-primary focus:outline-none focus:ring-4 focus:ring-red-100"
      >
        <FileText className="mr-2 h-4 w-4" />
        PDF
      </button>
    </div>
  );
}

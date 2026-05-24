import { ModuleReflectionForm } from "@/components/forms/module-actions";
import { Badge, Card, PageHeader, SecondaryLink } from "@/components/ui";
import { requireStudentProfile } from "@/lib/route-guards";
import { getModuleForStudent } from "@/lib/services/student-service";

const MODULE_PDF_URL = "/modules/PGSD-MODUL-2-Matematika-gabungan.pdf";

export default async function ModulDetailPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { student } = await requireStudentProfile();
  const { moduleId } = await params;
  const mod = await getModuleForStudent(student.id, moduleId);

  return (
    <>
      <PageHeader
        title={mod.title}
        description="Pelajari modul PDF berikut, lalu tulis refleksi untuk menyelesaikan modul."
        action={<SecondaryLink href="/mahasiswa/modul">Kembali</SecondaryLink>}
      />
      <div className="grid gap-4">
        {/* PDF Viewer */}
        <Card title="Modul PDF — Geometri dan Pengukuran">
          <p className="mb-4 text-sm text-muted">
            Baca modul berikut dengan seksama. Setelah selesai membaca, tulis refleksi di bawah untuk menandai modul sebagai selesai.
          </p>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              src={MODULE_PDF_URL}
              title="Modul 2 Pendalaman Materi Matematika"
              className="h-[600px] w-full"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={MODULE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong"
            >
              Buka PDF di Tab Baru
            </a>
            <a
              href={MODULE_PDF_URL}
              download="PGSD-MODUL-2-Matematika-gabungan.pdf"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-primary"
            >
              Unduh PDF
            </a>
          </div>
        </Card>

        {/* Refleksi + Selesai */}
        <Card title="Refleksi Modul" action={<Badge tone={mod.progress === "COMPLETED" ? "success" : "warning"}>{mod.progress === "COMPLETED" ? "Selesai" : "Belum selesai"}</Badge>}>
          {mod.progress === "COMPLETED" ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <p className="font-semibold">✅ Modul sudah selesai dipelajari.</p>
              <p className="mt-2">Refleksi Anda: {mod.reflectionText}</p>
            </div>
          ) : (
            <ModuleReflectionForm moduleId={mod.id} />
          )}
        </Card>
      </div>
    </>
  );
}

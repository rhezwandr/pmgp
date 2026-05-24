import { Card, PageHeader } from "@/components/ui";
import { requireTeacherProfile } from "@/lib/route-guards";

export default async function PengaturanPage() {
  const { user, teacher } = await requireTeacherProfile();
  return (
    <>
      <PageHeader title="Pengaturan" description="Informasi akun guru-dosen." />
      <Card title="Profil">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Nama</dt><dd className="font-medium">{user.name}</dd></div>
          <div><dt className="text-muted">Email</dt><dd className="font-medium">{user.email}</dd></div>
          <div><dt className="text-muted">Nomor Dosen</dt><dd className="font-medium">{teacher.lecturerNumber}</dd></div>
          <div><dt className="text-muted">Role</dt><dd className="font-medium">{user.role}</dd></div>
        </dl>
      </Card>
    </>
  );
}

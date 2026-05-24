import { Badge, Card, PageHeader } from "@/components/ui";
import { guardStudentAccess } from "@/lib/route-guards";
import { getFinalResult } from "@/lib/services/student-service";

export default async function FinalResultPage() {
  const { student } = await guardStudentAccess("postTest");
  const result = await getFinalResult(student.id);
  return (
    <>
      <PageHeader title="Final Result" description="Kesimpulan akhir hasil pembelajaran KAM-LKM." />
      <Card title="Hasil Akhir">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3"><p className="text-sm text-muted">Pre Test</p><p className="text-xl font-semibold text-stone-950">{result.preScore}</p></div>
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3"><p className="text-sm text-muted">Post Test</p><p className="text-xl font-semibold text-stone-950">{result.postScore}</p></div>
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3"><p className="text-sm text-muted">Improvement</p><p className="text-xl font-semibold text-stone-950">{result.improvement}</p></div>
        </div>
        <p className="mt-4 text-sm text-muted">{result.finalFeedback}</p>
        <p className="mt-2 text-sm text-muted">{result.recommendation}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.strongTopics.map((topic) => <Badge key={topic} tone="success">{topic}</Badge>)}
          {result.weakTopics.map((topic) => <Badge key={topic} tone="warning">{topic}</Badge>)}
        </div>
      </Card>
    </>
  );
}

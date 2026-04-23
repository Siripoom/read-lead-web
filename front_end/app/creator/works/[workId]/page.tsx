import CreatorWorkDetailPage from "@/components/creator/CreatorWorkDetailPage";

export default async function CreatorWorkPage({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const { workId } = await params;

  return <CreatorWorkDetailPage workId={workId} />;
}

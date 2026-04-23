import CreatorEpisodeFormPage from "@/components/creator/CreatorEpisodeFormPage";

export default async function NewCreatorEpisodePage({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const { workId } = await params;

  return <CreatorEpisodeFormPage mode="create" workId={workId} />;
}

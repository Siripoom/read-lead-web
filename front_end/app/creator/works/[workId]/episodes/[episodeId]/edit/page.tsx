import CreatorEpisodeFormPage from "@/components/creator/CreatorEpisodeFormPage";

export default async function EditCreatorEpisodePage({
  params,
}: {
  params: Promise<{ workId: string; episodeId: string }>;
}) {
  const { workId, episodeId } = await params;

  return <CreatorEpisodeFormPage mode="edit" workId={workId} episodeId={episodeId} />;
}

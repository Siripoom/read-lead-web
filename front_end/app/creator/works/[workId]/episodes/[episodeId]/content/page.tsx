import CreatorEpisodeContentEditPage from "@/components/creator/CreatorEpisodeContentEditPage";

export default async function EditCreatorEpisodeContentPage({
  params,
}: {
  params: Promise<{ workId: string; episodeId: string }>;
}) {
  const { workId, episodeId } = await params;

  return (
    <CreatorEpisodeContentEditPage workId={workId} episodeId={episodeId} />
  );
}

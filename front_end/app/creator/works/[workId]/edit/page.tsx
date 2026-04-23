import CreatorWorkFormPage from "@/components/creator/CreatorWorkFormPage";

export default async function EditCreatorWorkPage({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const { workId } = await params;

  return <CreatorWorkFormPage mode="edit" workId={workId} />;
}

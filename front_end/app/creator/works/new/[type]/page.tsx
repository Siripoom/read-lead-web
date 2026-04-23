import CreatorWorkFormPage from "@/components/creator/CreatorWorkFormPage";
import type { CreatorWorkType } from "@/lib/creator-studio";

export default async function NewCreatorWorkPage({
  params,
}: {
  params: Promise<{ type: CreatorWorkType }>;
}) {
  const { type } = await params;

  return <CreatorWorkFormPage mode="create" type={type} />;
}

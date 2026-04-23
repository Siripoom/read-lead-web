import CreatorStudioHome from "@/components/creator/CreatorStudioHome";

export default async function CreatorPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const tab = (await searchParams).tab;
  const activeTab = tab === "works" ? "works" : "overview";

  return <CreatorStudioHome activeTab={activeTab} />;
}

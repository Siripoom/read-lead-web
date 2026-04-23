import MainLayout from "@/components/layout/MainLayout";
import ContentHeader from "@/components/detail/ContentHeader";
import EpisodeList from "@/components/detail/EpisodeList";
import CommentSection from "@/components/detail/CommentSection";
import RelatedNovels from "@/components/detail/RelatedNovels";

export default function DetailPage() {
  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <ContentHeader />
        <EpisodeList />
        <CommentSection />
        <RelatedNovels />
      </div>
    </MainLayout>
  );
}

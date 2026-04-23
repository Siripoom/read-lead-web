import MainLayout from "@/components/layout/MainLayout";
import HeroSlider from "@/components/home/HeroSlider";
import GenreSelector from "@/components/home/GenreSelector";
import BookCarousel from "@/components/home/BookCarousel";
import FeaturedDuoSection from "@/components/home/FeaturedDuoSection";
import RankedGridSection from "@/components/home/RankedGridSection";
import UpdateListSection from "@/components/home/UpdateListSection";
import AdPlacementBanner from "@/components/ads/AdPlacementBanner";
import { MOCK_BOOKS, MOCK_BOOKS_WITH_UPDATES } from "@/lib/mock-data";
import type { Book } from "@/lib/mock-data";

export default function HomePage() {
  const featured = MOCK_BOOKS.slice(0, 2) as [Book, Book];
  const trending = MOCK_BOOKS.slice(2, 9);
  const ranked = MOCK_BOOKS.slice(0, 6);
  const newArrivals = MOCK_BOOKS.slice(6, 12);

  return (
    <MainLayout hero={<HeroSlider />}>
      <div className="p-6">
        <GenreSelector />
        <AdPlacementBanner placement="home_discover" className="mb-8" />

        {/* Type 1: 2 columns, 2 featured items */}
        <FeaturedDuoSection title="แนะนำสำหรับคุณ" books={featured} href="/discover" />

        {/* Type 2: horizontal scroll row */}
        <BookCarousel title="กำลังมาแรง" books={trending} href="/discover" />

        {/* Type 3: 2×3 ranked grid */}
        <RankedGridSection title="อันดับนิยม" books={ranked} href="/discover" />

        {/* Type 2: second horizontal carousel */}
        <BookCarousel title="มาใหม่ล่าสุด" books={newArrivals} href="/discover" />

        {/* Type 4: latest update list */}
        <UpdateListSection title="อัปเดตล่าสุด" items={MOCK_BOOKS_WITH_UPDATES} href="/discover" />
      </div>
    </MainLayout>
  );
}

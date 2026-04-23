"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import BookGridCard from "@/components/discover/BookGridCard";
import AdPlacementBanner from "@/components/ads/AdPlacementBanner";
import { MOCK_BOOKS } from "@/lib/mock-data";

type Genre = "all" | "novel" | "manga" | "audiobook";
type SortOption = "popular" | "rating" | "new";
type PriceFilter = "all" | "free" | "paid";

const GENRE_TABS: { value: Genre; label: string }[] = [
  { value: "all", label: "All" },
  { value: "novel", label: "Novels" },
  { value: "manga", label: "Manga" },
  { value: "audiobook", label: "Audiobooks" },
];

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverFallback />}>
      <DiscoverContent />
    </Suspense>
  );
}

function DiscoverFallback() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Discover Stories</h1>
          <p className="text-sm text-text-muted mt-1">Explore novels, manga, and audiobooks</p>
        </div>
      </div>
    </MainLayout>
  );
}

function DiscoverContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [genre, setGenre] = useState<Genre>((searchParams.get("genre") as Genre) ?? "all");
  const [sort, setSort] = useState<SortOption>("popular");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");

  const filtered = MOCK_BOOKS
    .filter((b) => genre === "all" || b.genre === genre)
    .filter((b) =>
      query.trim() === "" ||
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    )
    .filter((b) => {
      if (priceFilter === "free") return b.price === "free";
      if (priceFilter === "paid") return typeof b.price === "number";
      return true;
    })
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popular") return parseInt(b.reads) - parseInt(a.reads);
      return 0;
    });

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Discover Stories</h1>
          <p className="text-sm text-text-muted mt-1">Explore novels, manga, and audiobooks</p>
        </div>

        <AdPlacementBanner placement="home_discover" className="mb-6" />

        {/* Genre Tabs */}
        <div className="flex gap-1 bg-accent rounded-xl p-1 w-fit border border-border mb-5">
          {GENRE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setGenre(tab.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                genre === tab.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or tag..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-full border border-border focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-text-muted" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-sm border border-border rounded-full px-3 py-2 bg-white focus:outline-none focus:border-primary/50 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="new">New Releases</option>
            </select>

            {/* Price Filter */}
            <div className="flex gap-1 bg-accent rounded-full p-1 border border-border">
              {(["all", "free", "paid"] as PriceFilter[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all capitalize ${
                    priceFilter === p
                      ? "bg-white text-text-primary shadow-sm border border-border"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-xs text-text-muted mb-4">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
          {query && ` for "${query}"`}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((book) => (
              <BookGridCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
              <Search size={24} className="text-text-muted" />
            </div>
            <p className="text-lg font-semibold text-text-primary">No stories found</p>
            <p className="text-sm text-text-muted mt-1">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setQuery(""); setGenre("all"); setPriceFilter("all"); }}
              className="mt-4 text-sm text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

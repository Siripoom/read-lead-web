import Link from "next/link";
import { CATEGORY_MENU_ITEMS, getCategoryHref } from "@/lib/categories";
import SectionHeader from "@/components/ui/SectionHeader";

export default function GenreSelector() {
  return (
    <section className="mb-8">
      <SectionHeader title="หมวดหมู่" href="/discover" />

      <div className="bg-white rounded-2xl border border-border p-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_MENU_ITEMS.map((category) => (
            <Link
              key={category}
              href={getCategoryHref(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                category === "ทุกหมวดหมู่"
                  ? "border-primary/30 bg-primary-light text-primary hover:bg-primary-light"
                  : "bg-accent border-border text-text-muted hover:border-primary/40 hover:bg-primary-light hover:text-primary"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

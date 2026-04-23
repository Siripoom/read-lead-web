import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import type { BookWithUpdate } from "@/lib/mock-data";

interface UpdateListSectionProps {
  title: string;
  items: BookWithUpdate[];
  href?: string;
}

function UpdateListItem({ item, rank }: { item: BookWithUpdate; rank: number }) {
  const { book, latestEpisode, latestEpisodeTitle, updatedAt } = item;

  return (
    <Link
      href="/detail"
      className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-accent)] transition-colors -mx-3 px-3 group"
    >
      <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0">
        <Image src={book.cover} alt={book.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
            {book.title}
          </p>
          <div className="shrink-0">
            {book.price === "free" ? (
              <Badge variant="free">Free</Badge>
            ) : (
              <Badge variant="paid">{book.price} เหรียญ</Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{book.author}</p>
        <p className="text-xs mt-1">
          <span className="text-[var(--color-primary)] font-medium">
            ตอนที่ {latestEpisode}: {latestEpisodeTitle}
          </span>
          <span className="text-[var(--color-text-muted)]"> · {updatedAt}</span>
        </p>
      </div>
      <span className="text-sm text-[var(--color-text-muted)] w-5 text-right shrink-0">{rank}</span>
    </Link>
  );
}

export default function UpdateListSection({ title, items, href }: UpdateListSectionProps) {
  return (
    <section className="mb-8">
      <SectionHeader title={title} href={href} />
      <div className="bg-white rounded-2xl border border-[var(--color-border)] px-3">
        {items.map((item, index) => (
          <UpdateListItem key={item.book.id} item={item} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

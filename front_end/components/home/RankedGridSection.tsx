import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Book } from "@/lib/mock-data";

interface RankedGridSectionProps {
  title: string;
  books: Book[];
  href?: string;
}

function getRankStyle(rank: number): string {
  if (rank === 1) return "text-[var(--color-primary)] font-black text-2xl w-7 text-center shrink-0";
  if (rank <= 3) return "text-amber-500 font-black text-2xl w-7 text-center shrink-0";
  return "text-gray-400 font-bold text-xl w-7 text-center shrink-0";
}

function RankedItem({ book, rank }: { book: Book; rank: number }) {
  return (
    <Link
      href="/detail"
      className="flex items-center gap-3 bg-white rounded-xl border border-[var(--color-border)] p-3 hover:shadow-sm transition-all duration-200 group"
    >
      <span className={getRankStyle(rank)}>{rank}</span>
      <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0">
        <Image src={book.cover} alt={book.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
          {book.title}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{book.author}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-[var(--color-text-muted)]">{book.rating}</span>
          <span className="text-xs text-[var(--color-text-muted)]">· {book.reads}</span>
        </div>
      </div>
    </Link>
  );
}

export default function RankedGridSection({ title, books, href }: RankedGridSectionProps) {
  const displayBooks = books.slice(0, 6);

  return (
    <section className="mb-8">
      <SectionHeader title={title} href={href} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayBooks.map((book, index) => (
          <RankedItem key={book.id} book={book} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

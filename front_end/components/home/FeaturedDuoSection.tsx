import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Book } from "@/lib/mock-data";

interface FeaturedDuoSectionProps {
  title: string;
  books: [Book, Book];
  href?: string;
}

function FeaturedDuoCard({ book }: { book: Book }) {
  return (
    <Link href="/detail" className="group block">
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant={book.genre}>
            {book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}
          </Badge>
        </div>
        {book.price === "free" && (
          <div className="absolute top-3 right-3">
            <Badge variant="free">Free</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-bold text-base leading-tight line-clamp-2 mb-1">
            {book.title}
          </p>
          <p className="text-white/70 text-xs mb-2">{book.author}</p>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-white text-xs font-medium">{book.rating}</span>
            <span className="text-white/60 text-xs">· {book.reads} reads</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedDuoSection({ title, books, href }: FeaturedDuoSectionProps) {
  return (
    <section className="mb-8">
      <SectionHeader title={title} href={href} />
      <div className="grid grid-cols-2 gap-4">
        {books.map((book) => (
          <FeaturedDuoCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

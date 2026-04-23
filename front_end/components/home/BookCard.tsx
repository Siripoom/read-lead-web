import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { Book } from "@/lib/mock-data";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href="/detail" className="group flex-shrink-0 w-[160px]">
      <div className="relative w-[160px] h-[220px] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 left-2">
          <Badge variant={book.genre}>{book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}</Badge>
        </div>
        {book.price === "free" && (
          <div className="absolute top-2 right-2">
            <Badge variant="free">Free</Badge>
          </div>
        )}
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">{book.title}</p>
        <p className="text-xs text-text-muted mt-0.5">{book.author}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-text-muted">{book.rating}</span>
          <span className="text-xs text-text-muted">· {book.reads} reads</span>
        </div>
      </div>
    </Link>
  );
}

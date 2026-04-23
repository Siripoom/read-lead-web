import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { Book } from "@/lib/mock-data";

export default function BookGridCard({ book }: { book: Book }) {
  return (
    <Link href="/detail" className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <Badge variant={book.genre}>{book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}</Badge>
        </div>
        {book.price === "free" && (
          <div className="absolute top-2 right-2">
            <Badge variant="free">Free</Badge>
          </div>
        )}
        {typeof book.price === "number" && (
          <div className="absolute top-2 right-2">
            <Badge variant="paid">{book.price} coins</Badge>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {book.title}
        </p>
        <p className="text-xs text-text-muted">{book.author}</p>
        <div className="flex items-center gap-1 mt-auto pt-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-text-muted">{book.rating}</span>
          <span className="text-xs text-text-muted ml-auto">{book.reads} reads</span>
        </div>
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {book.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] bg-accent text-text-muted px-1.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

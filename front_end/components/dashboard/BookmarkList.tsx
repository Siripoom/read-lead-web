import Image from "next/image";
import Link from "next/link";
import { MOCK_BOOKS } from "@/lib/mock-data";

export default function BookmarkList() {
  const bookmarks = MOCK_BOOKS.slice(0, 4);
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-text-primary mb-3">Bookmarks</h3>
      <div className="grid grid-cols-4 gap-3">
        {bookmarks.map((book) => (
          <Link key={book.id} href="/detail" className="group">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image src={book.cover} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-xs font-medium text-text-primary mt-1.5 line-clamp-1 group-hover:text-primary transition-colors">{book.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

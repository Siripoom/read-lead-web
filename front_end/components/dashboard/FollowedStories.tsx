import Image from "next/image";
import Link from "next/link";
import { MOCK_BOOKS } from "@/lib/mock-data";

export default function FollowedStories() {
  const followed = MOCK_BOOKS.slice(2, 8);
  return (
    <div>
      <h3 className="text-sm font-bold text-text-primary mb-3">Following</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {followed.map((book) => (
          <Link key={book.id} href="/detail" className="group shrink-0 text-center w-[80px]">
            <div className="relative w-[80px] h-[110px] rounded-lg overflow-hidden">
              <Image src={book.cover} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-[11px] font-medium text-text-primary mt-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-tight">{book.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

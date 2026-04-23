"use client";

import { MOCK_BOOKS } from "@/lib/mock-data";
import BookGridCard from "@/components/discover/BookGridCard";

// Exclude the current book (id "1") and show up to 5 related novels
const RELATED_BOOKS = MOCK_BOOKS.filter((b) => b.id !== "1").slice(0, 5);

export default function RelatedNovels() {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-text-primary mb-4">Related Novels</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {RELATED_BOOKS.map((book) => (
          <div key={book.id} className="w-40 shrink-0">
            <BookGridCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}

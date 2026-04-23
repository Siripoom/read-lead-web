import BookCard from "./BookCard";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Book } from "@/lib/mock-data";

interface BookCarouselProps {
  title: string;
  books: Book[];
  href?: string;
}

export default function BookCarousel({ title, books, href }: BookCarouselProps) {
  return (
    <section className="mb-8">
      <SectionHeader title={title} href={href} />
      <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

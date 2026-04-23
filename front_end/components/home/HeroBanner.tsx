import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[340px] rounded-2xl overflow-hidden mb-8 shadow-sm">
      <Image
        src="https://placehold.co/1200x340/1a0a2e/white?text=."
        alt="Featured: The Obsidian Chronicles"
        fill
        className="object-cover"
        priority
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Featured Anthology</p>
        <h1 className="text-white text-4xl font-bold leading-tight mb-3 max-w-lg">
          The Obsidian Chronicles
        </h1>
        <p className="text-white/80 text-sm max-w-md mb-6 leading-relaxed">
          In a world where shadows hold memories, one young archivist discovers a forbidden tome that could rewrite history—or erase it.
        </p>
        <div className="flex gap-3">
          <Link
            href="/reader"
            className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-primary-hover transition-colors"
          >
            Read Now
          </Link>
          <Link
            href="/detail"
            className="bg-white/20 backdrop-blur text-white text-sm font-semibold px-6 py-2.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            Add to Library
          </Link>
        </div>
      </div>
    </div>
  );
}

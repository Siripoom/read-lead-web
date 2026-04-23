"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavbarClient() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/discover");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาเรื่อง..."
        className="w-full pl-9 pr-4 py-2 text-sm bg-accent rounded-full border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
      />
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { MOCK_EPISODES } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";

export default function EpisodeManager() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-border p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary">Episode Manager</h3>
        <button
          onClick={() => router.push("/creator/episode/new")}
          className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-primary-hover transition-colors"
        >
          + Add Episode
        </button>
      </div>

      <div className="space-y-2">
        {MOCK_EPISODES.map((ep) => (
          <div key={ep.id} className="flex items-center gap-4 p-3 bg-accent/50 rounded-lg">
            <span className="text-xs font-bold text-text-muted w-6">#{ep.number}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{ep.title}</p>
              <p className="text-xs text-text-muted">{ep.date}</p>
            </div>
            <Badge variant={ep.price === "free" ? "free" : "paid"}>
              {ep.price === "free" ? "Free" : `${ep.price} coins`}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { MOCK_COMMENTS } from "@/lib/mock-data";

const PREVIEW_COUNT = 2;

export default function CommentSection() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [showAll, setShowAll] = useState(false);

  const visibleComments = showAll ? MOCK_COMMENTS : MOCK_COMMENTS.slice(0, PREVIEW_COUNT);

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-4">Comments ({MOCK_COMMENTS.length})</h2>

      {/* Write Comment */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <p className="text-sm font-medium text-text-primary mb-3">Write a Review</p>
        <div className="flex gap-1 mb-3">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
            >
              <Star size={20} className={s <= (hovered || rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full text-sm border border-border rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <div className="mt-2 flex justify-end">
          <button className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-primary-hover transition-colors">
            Submit Review
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {visibleComments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Image src={c.avatar} alt={c.user} width={36} height={36} className="rounded-full shrink-0" />
            <div className="flex-1 bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-text-primary">{c.user}</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={11} className={s <= c.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-xs text-text-muted ml-auto">{c.date}</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {MOCK_COMMENTS.length > PREVIEW_COUNT && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            {showAll ? "Show less" : `More (${MOCK_COMMENTS.length - PREVIEW_COUNT} more)`}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Bookmark, UserPlus, BookOpen, Heart, Ticket } from "lucide-react";
import Badge from "@/components/ui/Badge";
import DonateModal from "./DonateModal";
import { useRole } from "@/context/RoleContext";
import {
  castStoryVote,
  formatVipTier,
  getVipTier,
  loadVipState,
  type VipState,
} from "@/lib/vip";

const STORY_ID = "obsidian-chronicles";
const STORY_TITLE = "The Obsidian Chronicles";
const AUTHOR_NAME = "Elara Vane";

export default function ContentHeader() {
  const { isLoggedIn } = useRole();
  const [showDonate, setShowDonate] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [vipState, setVipState] = useState<VipState>(() => loadVipState());

  useEffect(() => {
    const timer = window.setTimeout(() => setVipState(loadVipState()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const vipTier = getVipTier(vipState.totalTopUpCoins);
  const storyVotes = vipState.votesByStory[STORY_ID] ?? 0;
  const storyDonations = vipState.donationsByStory[STORY_ID] ?? 0;

  function handleVote(ticketType: "daily" | "monthly") {
    setVipState(castStoryVote(STORY_ID, ticketType));
  }

  return (
    <>
      <div className="flex gap-8 mb-8">
        {/* Cover */}
        <div className="relative w-[200px] h-[280px] rounded-xl overflow-hidden shadow-md shrink-0">
          <Image
            src="https://placehold.co/200x280/2D1B69/white?text=Obsidian"
            alt="The Obsidian Chronicles"
            fill
            className="object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            <Badge variant="novel">Novel</Badge>
            <Badge variant="free">Free</Badge>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{STORY_TITLE}</h1>
          <p className="text-text-muted text-sm mb-3">by <span className="text-text-primary font-medium">{AUTHOR_NAME}</span></p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={16} className={s <= 5 ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
            ))}
            <span className="text-sm font-semibold text-text-primary">4.9</span>
            <span className="text-sm text-text-muted">· 134k reads</span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            {["Fantasy", "Mystery", "Dark Fiction"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-accent rounded-full text-xs font-medium text-text-muted">{tag}</span>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-xl">
            In a world where shadows hold memories, one young archivist discovers a forbidden tome that could rewrite history—or erase it. A dark fantasy epic spanning six volumes, filled with political intrigue, ancient magic, and the cost of forbidden knowledge.
          </p>

          <div className="mb-6 rounded-xl border border-border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-text-primary">โหวตสนับสนุนเรื่องนี้</p>
                <p className="mt-1 text-xs text-text-muted">
                  {formatVipTier(vipTier)} · โหวตเรื่องนี้แล้ว {storyVotes} ครั้ง · โดเนทแล้ว {storyDonations} coins
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-text-muted">
                  <Ticket size={13} /> รายวัน {vipState.dailyTickets}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">
                  <Ticket size={13} /> รายเดือน {vipState.monthlyTickets}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleVote("daily")}
                disabled={vipState.dailyTickets <= 0}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Ticket size={15} />
                โหวตด้วยตั๋วรายวัน
              </button>
              <button
                onClick={() => handleVote("monthly")}
                disabled={vipState.monthlyTickets <= 0}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Ticket size={15} />
                โหวตด้วยตั๋วรายเดือน
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Link href="/reader" className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-primary-hover transition-colors">
              <BookOpen size={16} /> Read Now
            </Link>
            <button
              onClick={() => setBookmarked((v) => !v)}
              className={`flex items-center gap-2 border text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
                bookmarked
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-white text-text-primary hover:bg-accent"
              }`}
            >
              <Bookmark size={16} /> {bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <button
              onClick={() => setFollowed((v) => !v)}
              className={`flex items-center gap-2 border text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
                followed
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border bg-white text-text-primary hover:bg-accent"
              }`}
            >
              <UserPlus size={16} /> {followed ? "Following" : "Follow"}
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setShowDonate(true)}
                className="flex items-center gap-2 border border-pink-200 bg-pink-50 text-pink-600 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors"
              >
                <Heart size={16} /> Donate
              </button>
            )}
          </div>
        </div>
      </div>

      {showDonate && (
        <DonateModal
          storyId={STORY_ID}
          storyTitle={STORY_TITLE}
          authorName={AUTHOR_NAME}
          onClose={() => setShowDonate(false)}
          onSuccess={() => setVipState(loadVipState())}
        />
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PurchaseEpisodeModal from "./PurchaseEpisodeModal";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import {
  formatCreatorPrice,
  resolveEpisodePrice,
  type CreatorPromotion,
  type CreatorPromotionScope,
} from "@/lib/creator-studio";
import { MOCK_EPISODES } from "@/lib/mock-data";
import type { Episode } from "@/lib/mock-data";

const EPISODES_PER_GROUP = 20;
const DETAIL_WORK_ID = "work-obsidian-chronicles";

export type DisplayEpisode = Episode & {
  originalPrice: "free" | number;
  finalPrice: "free" | number;
  activePromotion?: CreatorPromotion & { scope: CreatorPromotionScope };
};

function chunkEpisodes(episodes: DisplayEpisode[], size: number): DisplayEpisode[][] {
  const groups: DisplayEpisode[][] = [];
  for (let i = 0; i < episodes.length; i += size) {
    groups.push(episodes.slice(i, i + size));
  }
  return groups;
}

interface EpisodeGroupProps {
  group: DisplayEpisode[];
  groupIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  purchasedIds: Set<string>;
  onSelectEp: (ep: DisplayEpisode) => void;
}

function EpisodeGroup({ group, groupIndex, isOpen, onToggle, purchasedIds, onSelectEp }: EpisodeGroupProps) {
  const start = groupIndex * EPISODES_PER_GROUP + 1;
  const end = start + group.length - 1;
  const freeCount = group.filter((e) => e.finalPrice === "free").length;

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-3">
      {/* Group header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-text-primary">
            ตอนที่ {start} – {end}
          </span>
          <span className="text-xs text-text-muted">
            ({group.length} ตอน{freeCount > 0 ? `, ฟรี ${freeCount} ตอน` : ""})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-text-muted shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-text-muted shrink-0" />
        )}
      </button>

      {/* Episode rows */}
      {isOpen && (
        <div className="divide-y divide-border">
          {group.map((ep) => {
            const unlocked = ep.finalPrice === "free" || purchasedIds.has(ep.id);
            return (
              <div
                key={ep.id}
                className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-accent/50 transition-colors group"
              >
                <span className="text-sm font-bold text-text-muted w-8 shrink-0">#{ep.number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                    {ep.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-text-muted">{ep.date}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Eye size={11} />
                      {ep.views >= 1000 ? `${(ep.views / 1000).toFixed(1)}k` : ep.views}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MessageCircle size={11} /> {ep.commentCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {ep.finalPrice === "free" && !ep.activePromotion ? (
                    <Badge variant="free">Free</Badge>
                  ) : unlocked ? (
                    <Badge variant="approved">Unlocked</Badge>
                  ) : ep.activePromotion ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      <Lock size={10} />
                      <span className="line-through text-amber-500">
                        {formatCreatorPrice(ep.originalPrice)}
                      </span>
                      <span>{formatCreatorPrice(ep.finalPrice)}</span>
                      <span>ลด {ep.activePromotion.discountPercent}%</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      <Lock size={10} /> {formatCreatorPrice(ep.finalPrice)}
                    </span>
                  )}

                  {unlocked ? (
                    <Link
                      href="/reader"
                      className="text-xs font-medium text-primary bg-primary-light px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      อ่าน
                    </Link>
                  ) : (
                    <button
                      onClick={() => onSelectEp(ep)}
                      className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors flex items-center gap-1"
                    >
                      <Lock size={10} /> ปลดล็อก
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EpisodeList() {
  const { getWorkById, getEpisodesByWorkId } = useCreatorStudio();
  const work = getWorkById(DETAIL_WORK_ID);
  const creatorEpisodes = work ? getEpisodesByWorkId(work.id) : [];
  const displayEpisodes = MOCK_EPISODES.map((episode) => {
    const creatorEpisode = creatorEpisodes.find(
      (item) => item.number === episode.number,
    );
    const priceSource = creatorEpisode ?? { price: episode.price };
    const resolvedPrice = resolveEpisodePrice(priceSource, work);

    return {
      ...episode,
      title: creatorEpisode?.title ?? episode.title,
      date: creatorEpisode?.releaseDate ?? episode.date,
      price: resolvedPrice.finalPrice,
      originalPrice: resolvedPrice.originalPrice,
      finalPrice: resolvedPrice.finalPrice,
      activePromotion: resolvedPrice.activePromotion,
    };
  });
  const groups = chunkEpisodes(displayEpisodes, EPISODES_PER_GROUP);
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set([0]));
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [walletCoins, setWalletCoins] = useState(450);
  const [selectedEp, setSelectedEp] = useState<DisplayEpisode | null>(null);

  function toggleGroup(index: number) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handlePurchase(id: string) {
    const ep = displayEpisodes.find((e) => e.id === id);
    if (ep && typeof ep.finalPrice === "number") {
      setWalletCoins((c) => c - ep.finalPrice);
      setPurchasedIds((prev) => new Set(prev).add(id));
    }
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-bold text-text-primary mb-4">
          ตอนทั้งหมด ({displayEpisodes.length})
        </h2>
        {groups.map((group, i) => (
          <EpisodeGroup
            key={i}
            group={group}
            groupIndex={i}
            isOpen={openGroups.has(i)}
            onToggle={() => toggleGroup(i)}
            purchasedIds={purchasedIds}
            onSelectEp={setSelectedEp}
          />
        ))}
      </div>

      {selectedEp && (
        <PurchaseEpisodeModal
          episode={selectedEp}
          walletCoins={walletCoins}
          onClose={() => setSelectedEp(null)}
          onPurchase={handlePurchase}
        />
      )}
    </>
  );
}

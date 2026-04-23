"use client";

import { useState } from "react";
import { X, Lock, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCreatorPrice } from "@/lib/creator-studio";
import type { DisplayEpisode } from "./EpisodeList";

interface Props {
  episode: DisplayEpisode;
  walletCoins: number;
  onClose: () => void;
  onPurchase: (episodeId: string) => void;
}

export default function PurchaseEpisodeModal({ episode, walletCoins, onClose, onPurchase }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const cost = typeof episode.finalPrice === "number" ? episode.finalPrice : 0;
  const afterBalance = walletCoins - cost;
  const insufficient = afterBalance < 0;

  function handleUnlock() {
    setLoading(true);
    setTimeout(() => {
      onPurchase(episode.id);
      onClose();
      router.push("/reader");
    }, 800);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-text-primary">Unlock Episode</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Lock Icon */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mb-3">
            <Lock size={24} className="text-primary" />
          </div>
          <p className="text-sm text-text-muted">Episode {episode.number}</p>
          <p className="text-base font-semibold text-text-primary mt-0.5">{episode.title}</p>
        </div>

        {/* Cost */}
        <div className="bg-accent rounded-xl p-4 space-y-2 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Episode cost</span>
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <Coins size={13} className="text-amber-500" />
              {episode.activePromotion && (
                <span className="text-xs text-text-muted line-through">
                  {formatCreatorPrice(episode.originalPrice)}
                </span>
              )}
              <span>{formatCreatorPrice(episode.finalPrice)}</span>
              {episode.activePromotion && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">
                  ลด {episode.activePromotion.discountPercent}%
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Your balance</span>
            <span className="font-semibold text-text-primary flex items-center gap-1">
              <Coins size={13} className="text-amber-500" /> {walletCoins} coins
            </span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
            <span className="text-text-muted">After purchase</span>
            <span className={`font-bold flex items-center gap-1 ${insufficient ? "text-red-600" : "text-emerald-600"}`}>
              <Coins size={13} /> {afterBalance} coins
            </span>
          </div>
        </div>

        {insufficient && (
          <p className="text-xs text-red-600 text-center mb-4">
            Insufficient coins.{" "}
            <a href="/dashboard" className="underline font-medium">Top up your wallet</a>
          </p>
        )}

        {/* Footer */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-text-primary text-sm font-medium py-2.5 rounded-full hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUnlock}
            disabled={loading || insufficient}
            className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Unlocking..." : "Unlock & Read"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Coins, Plus, ArrowDownLeft } from "lucide-react";
import TopUpModal from "./TopUpModal";
import { applyVipTopUp } from "@/lib/vip";

export default function WalletCard() {
  const [coins, setCoins] = useState(450);
  const [showTopUp, setShowTopUp] = useState(false);

  return (
    <>
      <Card className="p-5 bg-gradient-to-br from-primary to-primary-hover text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coins size={18} />
            <span className="text-sm font-semibold opacity-90">My Wallet</span>
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> Top Up
          </button>
        </div>
        <p className="text-3xl font-bold mb-1">{coins} <span className="text-lg font-normal opacity-80">coins</span></p>
        <p className="text-xs opacity-70">≈ ${(coins * 0.01).toFixed(2)} USD</p>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs opacity-70 mb-2">Recent</p>
          <div className="flex items-center gap-2 text-xs">
            <ArrowDownLeft size={12} />
            <span className="opacity-80">Bought 200 coins</span>
            <span className="ml-auto opacity-60">Mar 20</span>
          </div>
        </div>
      </Card>

      {showTopUp && (
        <TopUpModal
          onClose={() => setShowTopUp(false)}
          onSuccess={(added) => {
            applyVipTopUp(added);
            setCoins((c) => c + added);
          }}
        />
      )}
    </>
  );
}

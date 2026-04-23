"use client";

import { useState } from "react";
import { Coins, Heart, X } from "lucide-react";
import { getCoins } from "@/lib/coins";
import { donateToStory } from "@/lib/vip";

interface DonateModalProps {
  storyId: string;
  storyTitle: string;
  authorName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DONATION_AMOUNTS = [10, 50, 100, 200];

export default function DonateModal({
  storyId,
  storyTitle,
  authorName,
  onClose,
  onSuccess,
}: DonateModalProps) {
  const [coins, setCoins] = useState(() => getCoins());
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) || 0 : amount;

  function handleDonate() {
    const result = donateToStory(storyId, finalAmount);
    if (!result.ok) {
      setError("เหรียญไม่พอสำหรับโดเนทครั้งนี้");
      return;
    }

    setCoins(result.remainingCoins ?? 0);
    setDone(true);
    onSuccess();
    window.setTimeout(onClose, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
              <Heart size={16} className="text-pink-600" />
            </div>
            <h2 className="text-base font-bold text-text-primary">โดเนทให้นักเขียน</h2>
          </div>
          <button onClick={onClose} className="text-text-muted transition-colors hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
              <Heart size={28} className="text-pink-600" />
            </div>
            <p className="text-lg font-bold text-text-primary">ส่งโดเนทแล้ว</p>
            <p className="text-sm text-text-muted">
              {finalAmount} coins ถูกส่งให้ {authorName}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 rounded-xl bg-accent px-4 py-3 text-sm text-text-muted">
              เรื่อง: <span className="font-semibold text-text-primary">{storyTitle}</span>
              <br />
              ผู้เขียน: <span className="font-semibold text-text-primary">{authorName}</span>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              จำนวนเหรียญ
            </p>
            <div className="mb-3 grid grid-cols-4 gap-2">
              {DONATION_AMOUNTS.map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount("");
                    setError("");
                  }}
                  className={`rounded-xl border-2 py-2 text-sm font-semibold transition-all ${
                    amount === value && !customAmount
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              value={customAmount}
              onChange={(event) => {
                setCustomAmount(event.target.value);
                setError("");
              }}
              placeholder="กำหนดเอง"
              className="mb-4 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, 120))}
              placeholder="ข้อความถึงนักเขียน (ไม่บังคับ)"
              rows={3}
              className="mb-1 w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <p className="mb-4 text-right text-xs text-text-muted">{message.length}/120</p>

            <div className="mb-5 flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-sm">
              <span className="text-text-muted">คงเหลือในกระเป๋า</span>
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Coins size={13} /> {coins} coins
              </span>
            </div>

            {error && <p className="mb-4 text-center text-xs text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-accent"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDonate}
                disabled={finalAmount <= 0}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-pink-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
              >
                <Heart size={14} />
                โดเนท {finalAmount} coins
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Gift, Coins } from "lucide-react";
import { MOCK_EPISODES } from "@/lib/mock-data";

type GiftType = "coin" | "episode";

const COIN_AMOUNTS = [10, 50, 100, 200];

interface Props {
  storyTitle: string;
  onClose: () => void;
}

export default function GiftModal({ storyTitle, onClose }: Props) {
  const [giftType, setGiftType] = useState<GiftType>("coin");
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const paidEpisodes = MOCK_EPISODES.filter((e) => typeof e.price === "number");
  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  function handleSend() {
    if (!recipient.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => onClose(), 1500);
    }, 1000);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
              <Gift size={16} className="text-pink-600" />
            </div>
            <h2 className="text-base font-bold text-text-primary">Send a Gift</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
              <Gift size={28} className="text-pink-600" />
            </div>
            <p className="text-lg font-bold text-text-primary">Gift Sent!</p>
            <p className="text-sm text-text-muted">Your gift has been sent to {recipient}</p>
          </div>
        ) : (
          <>
            {/* Story info */}
            <div className="bg-accent rounded-xl px-4 py-3 mb-5 text-sm text-text-muted">
              Gifting for: <span className="font-semibold text-text-primary">{storyTitle}</span>
            </div>

            {/* Gift Type Tabs */}
            <div className="flex gap-1 bg-accent rounded-xl p-1 border border-border mb-5">
              {(["coin", "episode"] as GiftType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setGiftType(t)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all capitalize ${
                    giftType === t ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {t === "coin" ? "Coin Gift" : "Episode Gift"}
                </button>
              ))}
            </div>

            {giftType === "coin" ? (
              <>
                {/* Coin Amount */}
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Amount</p>
                <div className="flex gap-2 mb-3">
                  {COIN_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustomAmount(""); }}
                      className={`flex-1 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                        amount === a && !customAmount
                          ? "border-primary bg-primary-light text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Custom amount..."
                  className="w-full mb-4 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </>
            ) : (
              <>
                {/* Episode Select */}
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Select Episode</p>
                <select
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(e.target.value)}
                  className="w-full mb-4 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-white"
                >
                  <option value="">Choose episode...</option>
                  {paidEpisodes.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      Ep.{ep.number} · {ep.title} ({ep.price} coins)
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Recipient */}
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Recipient Username</p>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Send to username..."
              className="w-full mb-4 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />

            {/* Message */}
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Message (optional)</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 100))}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full mb-1 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
            />
            <p className="text-right text-xs text-text-muted mb-4">{message.length}/100</p>

            {/* Cost summary */}
            {giftType === "coin" && (
              <div className="bg-accent rounded-xl px-4 py-3 mb-5 flex items-center justify-between text-sm">
                <span className="text-text-muted">Gift cost</span>
                <span className="font-semibold text-primary flex items-center gap-1">
                  <Coins size={13} /> {finalAmount} coins
                </span>
              </div>
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
                onClick={handleSend}
                disabled={loading || !recipient.trim() || (giftType === "episode" && !selectedEpisode)}
                className="flex-1 bg-pink-500 text-white text-sm font-semibold py-2.5 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Gift size={14} /> {loading ? "Sending..." : "Send Gift"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

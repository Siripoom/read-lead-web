"use client";

import { useEffect, useState } from "react";
import { X, Coins, CreditCard, QrCode, Wallet } from "lucide-react";
import { getActiveCoinOffers } from "@/lib/monetization";

interface CoinPackage {
  coins: number;
  price: number;
  label?: string;
  highlight?: boolean;
}

const COIN_PACKAGES: CoinPackage[] = [
  { coins: 50, price: 15 },
  { coins: 100, price: 25 },
  { coins: 200, price: 45, highlight: true, label: "Best Value" },
  { coins: 500, price: 99 },
  { coins: 1000, price: 179 },
  { coins: 2000, price: 299, label: "Premium" },
];

type PaymentMethod = "card" | "promptpay" | "truemoney";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: "card", label: "Credit / Debit Card", icon: <CreditCard size={16} /> },
  { value: "promptpay", label: "PromptPay", icon: <QrCode size={16} /> },
  { value: "truemoney", label: "TrueMoney Wallet", icon: <Wallet size={16} /> },
];

interface Props {
  onClose: () => void;
  onSuccess: (coins: number) => void;
}

export default function TopUpModal({ onClose, onSuccess }: Props) {
  const [packages, setPackages] = useState<CoinPackage[]>(COIN_PACKAGES);
  const [selected, setSelected] = useState(2);
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const activeOffers = getActiveCoinOffers().map((offer) => ({
        coins: offer.coins,
        price: offer.price,
        label: offer.label || offer.name,
        highlight: offer.highlight,
      }));

      if (activeOffers.length > 0) {
        setPackages(activeOffers);
        const highlightIndex = activeOffers.findIndex((offer) => offer.highlight);
        setSelected(highlightIndex >= 0 ? highlightIndex : 0);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const pkg = packages[selected] ?? packages[0] ?? COIN_PACKAGES[0];

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        onSuccess(pkg.coins);
        onClose();
      }, 1200);
    }, 1500);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <Coins size={16} className="text-primary" />
            </div>
            <h2 className="text-base font-bold text-text-primary">Top Up Coins</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <Coins size={28} className="text-emerald-600" />
            </div>
            <p className="text-lg font-bold text-text-primary">Payment Successful!</p>
            <p className="text-sm text-text-muted">+{pkg.coins} coins added to your wallet</p>
          </div>
        ) : (
          <>
            {/* Packages */}
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Select Package</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {packages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    selected === i
                      ? "border-primary bg-primary-light"
                      : "border-border hover:border-primary/40 bg-white"
                  }`}
                >
                  {p.highlight && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      Best Value
                    </span>
                  )}
                  {p.label && !p.highlight && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {p.label}
                    </span>
                  )}
                  <Coins size={16} className={selected === i ? "text-primary" : "text-text-muted"} />
                  <span className={`text-base font-bold mt-1 ${selected === i ? "text-primary" : "text-text-primary"}`}>
                    {p.coins}
                  </span>
                  <span className="text-[10px] text-text-muted">coins</span>
                  <span className={`text-xs font-semibold mt-1 ${selected === i ? "text-primary" : "text-text-muted"}`}>
                    ฿{p.price}
                  </span>
                </button>
              ))}
            </div>

            {/* Payment Method */}
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Payment Method</p>
            <div className="space-y-2 mb-5">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    payment === m.value ? "border-primary bg-primary-light" : "border-border hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.value}
                    checked={payment === m.value}
                    onChange={() => setPayment(m.value)}
                    className="accent-primary"
                  />
                  <span className={payment === m.value ? "text-primary" : "text-text-muted"}>{m.icon}</span>
                  <span className="text-sm font-medium text-text-primary">{m.label}</span>
                </label>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-accent rounded-xl p-3 mb-5 flex items-center justify-between">
              <span className="text-sm text-text-muted">You will receive</span>
              <span className="text-sm font-bold text-primary flex items-center gap-1">
                <Coins size={14} /> {pkg.coins} coins for ฿{pkg.price}
              </span>
            </div>

            {/* Footer */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-border text-text-primary text-sm font-medium py-2.5 rounded-full hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-full hover:bg-primary-hover transition-colors disabled:opacity-60"
              >
                {loading ? "Processing..." : `Confirm ฿${pkg.price}`}
              </button>
            </div>
            <p className="text-center text-[11px] text-text-muted mt-3">Coins are non-refundable after purchase</p>
          </>
        )}
      </div>
    </div>
  );
}

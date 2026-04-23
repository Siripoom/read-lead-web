"use client";

import { useState } from "react";
import { X, Coins } from "lucide-react";

export default function WithdrawButton() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-primary-hover transition-colors flex items-center gap-2"
      >
        <Coins size={16} /> Request Withdrawal
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary">Withdraw Earnings</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-accent rounded-lg"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <p className="text-xs text-primary font-medium">Available Balance</p>
                <p className="text-3xl font-bold text-primary mt-1">฿92,800</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Amount (THB)</label>
                <input type="number" placeholder="Enter amount..." className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Method</label>
                <select className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 bg-white">
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>PromptPay</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-border">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-border text-text-primary text-sm font-medium py-2.5 rounded-full hover:bg-accent transition-colors">Cancel</button>
              <button className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-full hover:bg-primary-hover transition-colors">Confirm Withdrawal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

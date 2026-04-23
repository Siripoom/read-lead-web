"use client";

import { useEffect, useState } from "react";
import { Coins, Edit3, Plus, Save, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  createMonetizationId,
  loadMonetizationSettings,
  normalizeEpisodePricePolicy,
  saveMonetizationSettings,
  type CoinOffer,
  type EpisodePricePolicy,
  type MonetizationSettings,
  type VipTier,
} from "@/lib/monetization";

const EMPTY_OFFER: Omit<CoinOffer, "id"> = {
  name: "",
  coins: 100,
  price: 25,
  label: "",
  highlight: false,
  active: true,
};

const EMPTY_VIP_TIER: Omit<VipTier, "id"> = {
  level: 1,
  name: "",
  title: "",
  minTopUpCoins: 100,
  monthlyTickets: 3,
};

export default function MonetizationPanel() {
  const [settings, setSettings] = useState<MonetizationSettings>(() =>
    loadMonetizationSettings()
  );
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerDraft, setOfferDraft] = useState<Omit<CoinOffer, "id">>(EMPTY_OFFER);
  const [editingVipTierId, setEditingVipTierId] = useState<string | null>(null);
  const [vipTierDraft, setVipTierDraft] =
    useState<Omit<VipTier, "id">>(EMPTY_VIP_TIER);
  const [policyDraft, setPolicyDraft] = useState<EpisodePricePolicy>(
    settings.episodePricePolicy
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loaded = loadMonetizationSettings();
      setSettings(loaded);
      setPolicyDraft(loaded.episodePricePolicy);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function persist(next: MonetizationSettings) {
    setSettings(next);
    saveMonetizationSettings(next);
  }

  function resetOfferForm() {
    setEditingOfferId(null);
    setOfferDraft(EMPTY_OFFER);
  }

  function submitOffer() {
    const normalizedOffer = {
      ...offerDraft,
      name: offerDraft.name.trim() || `${offerDraft.coins} coins`,
      coins: Math.max(0, Math.floor(offerDraft.coins)),
      price: Math.max(0, offerDraft.price),
      label: offerDraft.label.trim(),
    };

    if (editingOfferId) {
      persist({
        ...settings,
        coinOffers: settings.coinOffers.map((offer) =>
          offer.id === editingOfferId ? { ...normalizedOffer, id: offer.id } : offer
        ),
      });
      resetOfferForm();
      return;
    }

    persist({
      ...settings,
      coinOffers: [
        ...settings.coinOffers,
        { ...normalizedOffer, id: createMonetizationId("offer") },
      ],
    });
    resetOfferForm();
  }

  function editOffer(offer: CoinOffer) {
    setEditingOfferId(offer.id);
    setOfferDraft({
      name: offer.name,
      coins: offer.coins,
      price: offer.price,
      label: offer.label,
      highlight: offer.highlight,
      active: offer.active,
    });
  }

  function savePolicy() {
    const nextPolicy = normalizeEpisodePricePolicy(policyDraft);
    setPolicyDraft(nextPolicy);
    persist({ ...settings, episodePricePolicy: nextPolicy });
  }

  function resetVipTierForm() {
    setEditingVipTierId(null);
    setVipTierDraft(EMPTY_VIP_TIER);
  }

  function submitVipTier() {
    const normalizedTier = {
      ...vipTierDraft,
      level: Math.max(1, Math.floor(vipTierDraft.level)),
      name: vipTierDraft.name.trim() || `VIP ${vipTierDraft.level}`,
      title: vipTierDraft.title.trim() || "นักอ่าน VIP",
      minTopUpCoins: Math.max(0, Math.floor(vipTierDraft.minTopUpCoins)),
      monthlyTickets: Math.max(0, Math.floor(vipTierDraft.monthlyTickets)),
    };

    if (editingVipTierId) {
      persist({
        ...settings,
        vipTiers: settings.vipTiers
          .map((tier) =>
            tier.id === editingVipTierId ? { ...normalizedTier, id: tier.id } : tier
          )
          .sort((left, right) => left.minTopUpCoins - right.minTopUpCoins),
      });
      resetVipTierForm();
      return;
    }

    persist({
      ...settings,
      vipTiers: [
        ...settings.vipTiers,
        { ...normalizedTier, id: createMonetizationId("vip") },
      ].sort((left, right) => left.minTopUpCoins - right.minTopUpCoins),
    });
    resetVipTierForm();
  }

  function editVipTier(tier: VipTier) {
    setEditingVipTierId(tier.id);
    setVipTierDraft({
      level: tier.level,
      name: tier.name,
      title: tier.title,
      minTopUpCoins: tier.minTopUpCoins,
      monthlyTickets: tier.monthlyTickets,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="border border-border">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-text-primary">โปรโมชันซื้อเหรียญ</h2>
            <p className="text-sm text-text-muted">
              แพ็กที่เปิดใช้งานจะไปแสดงใน modal เติมเหรียญ
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-accent/60 text-left">
              <tr>
                {["ชื่อโปร", "เหรียญ", "ราคา", "ป้าย", "สถานะ", "จัดการ"].map((head) => (
                  <th key={head} className="px-5 py-3 font-semibold text-text-muted">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settings.coinOffers.map((offer, index) => (
                <tr
                  key={offer.id}
                  className={index < settings.coinOffers.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-5 py-4 font-semibold text-text-primary">{offer.name}</td>
                  <td className="px-5 py-4 text-text-muted">{offer.coins}</td>
                  <td className="px-5 py-4 text-text-muted">฿{offer.price}</td>
                  <td className="px-5 py-4 text-text-muted">
                    {offer.label || (offer.highlight ? "Highlight" : "-")}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        persist({
                          ...settings,
                          coinOffers: settings.coinOffers.map((item) =>
                            item.id === offer.id ? { ...item, active: !item.active } : item
                          ),
                        })
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        offer.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {offer.active ? "เปิดใช้งาน" : "ปิด"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => editOffer(offer)}>
                        <Edit3 size={14} />
                        แก้ไข
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          persist({
                            ...settings,
                            coinOffers: settings.coinOffers.filter(
                              (item) => item.id !== offer.id
                            ),
                          })
                        }
                      >
                        <Trash2 size={14} />
                        ลบ
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="border border-border p-5">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-text-primary">
              {editingOfferId ? "แก้ไขโปรเหรียญ" : "เพิ่มโปรเหรียญ"}
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            <input
              value={offerDraft.name}
              onChange={(event) =>
                setOfferDraft((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="ชื่อโปรโมชัน"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={0}
                value={offerDraft.coins}
                onChange={(event) =>
                  setOfferDraft((prev) => ({
                    ...prev,
                    coins: Number(event.target.value) || 0,
                  }))
                }
                aria-label="จำนวนเหรียญ"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                value={offerDraft.price}
                onChange={(event) =>
                  setOfferDraft((prev) => ({
                    ...prev,
                    price: Number(event.target.value) || 0,
                  }))
                }
                aria-label="ราคาโปรโมชัน"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            <input
              value={offerDraft.label}
              onChange={(event) =>
                setOfferDraft((prev) => ({ ...prev, label: event.target.value }))
              }
              placeholder="ป้าย เช่น Best Value"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
            />
            <div className="flex flex-wrap gap-4 text-sm text-text-muted">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={offerDraft.highlight}
                  onChange={(event) =>
                    setOfferDraft((prev) => ({
                      ...prev,
                      highlight: event.target.checked,
                    }))
                  }
                  className="accent-primary"
                />
                Highlight
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={offerDraft.active}
                  onChange={(event) =>
                    setOfferDraft((prev) => ({
                      ...prev,
                      active: event.target.checked,
                    }))
                  }
                  className="accent-primary"
                />
                เปิดใช้งาน
              </label>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={submitOffer}>
                {editingOfferId ? <Save size={15} /> : <Plus size={15} />}
                {editingOfferId ? "บันทึก" : "เพิ่มโปร"}
              </Button>
              {editingOfferId && (
                <Button variant="secondary" onClick={resetOfferForm}>
                  <X size={15} />
                  ยกเลิก
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="border border-border p-5">
          <h2 className="text-lg font-bold text-text-primary">กรอบราคาต่อตอน</h2>
          <p className="mt-1 text-sm text-text-muted">
            ใช้ควบคุม input ราคาในสตูดิโอนักเขียน
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["minCoins", "ขั้นต่ำ"],
              ["recommendedCoins", "แนะนำ"],
              ["maxCoins", "สูงสุด"],
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-semibold text-text-muted">
                {label}
                <input
                  type="number"
                  min={0}
                  value={policyDraft[key as keyof EpisodePricePolicy]}
                  onChange={(event) =>
                    setPolicyDraft((prev) => ({
                      ...prev,
                      [key]: Number(event.target.value) || 0,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-text-primary focus:border-primary/50 focus:outline-none"
                />
              </label>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={savePolicy}>
            <Save size={15} />
            บันทึกกรอบราคา
          </Button>
        </Card>

        <Card className="border border-border p-5">
          <h2 className="text-lg font-bold text-text-primary">
            {editingVipTierId ? "แก้ไขระดับ VIP" : "เพิ่มระดับ VIP"}
          </h2>
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={1}
                value={vipTierDraft.level}
                onChange={(event) =>
                  setVipTierDraft((prev) => ({
                    ...prev,
                    level: Number(event.target.value) || 1,
                  }))
                }
                aria-label="ระดับ VIP"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                value={vipTierDraft.minTopUpCoins}
                onChange={(event) =>
                  setVipTierDraft((prev) => ({
                    ...prev,
                    minTopUpCoins: Number(event.target.value) || 0,
                  }))
                }
                aria-label="ยอดเติมขั้นต่ำ"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            <input
              value={vipTierDraft.name}
              onChange={(event) =>
                setVipTierDraft((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="ชื่อระดับ เช่น Gold Reader"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
            />
            <input
              value={vipTierDraft.title}
              onChange={(event) =>
                setVipTierDraft((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="ฉายา เช่น ผู้อุปถัมภ์นิยาย"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
            />
            <input
              type="number"
              min={0}
              value={vipTierDraft.monthlyTickets}
              onChange={(event) =>
                setVipTierDraft((prev) => ({
                  ...prev,
                  monthlyTickets: Number(event.target.value) || 0,
                }))
              }
              aria-label="ตั๋วรายเดือน"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={submitVipTier}>
                {editingVipTierId ? <Save size={15} /> : <Plus size={15} />}
                {editingVipTierId ? "บันทึก VIP" : "เพิ่ม VIP"}
              </Button>
              {editingVipTierId && (
                <Button variant="secondary" onClick={resetVipTierForm}>
                  <X size={15} />
                  ยกเลิก
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="border border-border xl:col-span-2">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-text-primary">ระดับ VIP และตั๋วโหวต</h2>
          <p className="text-sm text-text-muted">
            ผู้อ่านได้รับตั๋วรายวันฟรีวันละ 1 ใบ และได้รับตั๋วรายเดือนเมื่อเติมเหรียญตามระดับ
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-accent/60 text-left">
              <tr>
                {["ระดับ", "ชื่อ", "ฉายา", "ยอดเติมขั้นต่ำ", "ตั๋วรายเดือน", "จัดการ"].map(
                  (head) => (
                    <th key={head} className="px-5 py-3 font-semibold text-text-muted">
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {settings.vipTiers.map((tier, index) => (
                <tr
                  key={tier.id}
                  className={index < settings.vipTiers.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-5 py-4 font-semibold text-text-primary">VIP {tier.level}</td>
                  <td className="px-5 py-4 text-text-muted">{tier.name}</td>
                  <td className="px-5 py-4 text-text-muted">{tier.title}</td>
                  <td className="px-5 py-4 text-text-muted">{tier.minTopUpCoins} coins</td>
                  <td className="px-5 py-4 text-text-muted">{tier.monthlyTickets} ใบ</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => editVipTier(tier)}>
                        <Edit3 size={14} />
                        แก้ไข
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          persist({
                            ...settings,
                            vipTiers: settings.vipTiers.filter(
                              (item) => item.id !== tier.id
                            ),
                          })
                        }
                      >
                        <Trash2 size={14} />
                        ลบ
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

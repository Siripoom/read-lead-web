"use client";

import { useEffect, useState } from "react";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  AD_PLACEMENT_LABELS,
  createMonetizationId,
  loadMonetizationSettings,
  saveMonetizationSettings,
  type AdCampaign,
  type AdPlacement,
  type MonetizationSettings,
} from "@/lib/monetization";

const EMPTY_AD: Omit<AdCampaign, "id"> = {
  placement: "home_discover",
  title: "",
  body: "",
  ctaLabel: "อ่านต่อ",
  href: "/discover",
  imageUrl: "https://placehold.co/960x240/E11D2E/white?text=ReadLead+Ad",
  active: true,
};

export default function AdvertisingPanel() {
  const [settings, setSettings] = useState<MonetizationSettings>(() =>
    loadMonetizationSettings()
  );
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adDraft, setAdDraft] = useState<Omit<AdCampaign, "id">>(EMPTY_AD);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettings(loadMonetizationSettings());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function persist(next: MonetizationSettings) {
    setSettings(next);
    saveMonetizationSettings(next);
  }

  function resetForm() {
    setEditingAdId(null);
    setAdDraft(EMPTY_AD);
  }

  function submitAd() {
    const normalizedAd = {
      ...adDraft,
      title: adDraft.title.trim() || "ReadLead Promotion",
      body: adDraft.body.trim(),
      ctaLabel: adDraft.ctaLabel.trim() || "อ่านต่อ",
      href: adDraft.href.trim() || "/discover",
      imageUrl: adDraft.imageUrl.trim(),
    };

    if (editingAdId) {
      persist({
        ...settings,
        ads: settings.ads.map((ad) =>
          ad.id === editingAdId ? { ...normalizedAd, id: ad.id } : ad
        ),
      });
      resetForm();
      return;
    }

    persist({
      ...settings,
      ads: [...settings.ads, { ...normalizedAd, id: createMonetizationId("ad") }],
    });
    resetForm();
  }

  function editAd(ad: AdCampaign) {
    setEditingAdId(ad.id);
    setAdDraft({
      placement: ad.placement,
      title: ad.title,
      body: ad.body,
      ctaLabel: ad.ctaLabel,
      href: ad.href,
      imageUrl: ad.imageUrl,
      active: ad.active,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="border border-border">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-text-primary">โฆษณา</h2>
          <p className="text-sm text-text-muted">
            จัดการ placement หน้าแรก/ค้นพบ และหน้าอ่านนิยาย
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-accent/60 text-left">
              <tr>
                {["ชื่อ", "Placement", "CTA", "สถานะ", "จัดการ"].map((head) => (
                  <th key={head} className="px-5 py-3 font-semibold text-text-muted">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settings.ads.map((ad, index) => (
                <tr
                  key={ad.id}
                  className={index < settings.ads.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-text-primary">{ad.title}</p>
                    <p className="mt-1 max-w-md truncate text-xs text-text-muted">{ad.body}</p>
                  </td>
                  <td className="px-5 py-4 text-text-muted">
                    {AD_PLACEMENT_LABELS[ad.placement]}
                  </td>
                  <td className="px-5 py-4 text-text-muted">{ad.ctaLabel}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        persist({
                          ...settings,
                          ads: settings.ads.map((item) =>
                            item.id === ad.id ? { ...item, active: !item.active } : item
                          ),
                        })
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        ad.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ad.active ? "เปิดใช้งาน" : "ปิด"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => editAd(ad)}>
                        <Edit3 size={14} />
                        แก้ไข
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          persist({
                            ...settings,
                            ads: settings.ads.filter((item) => item.id !== ad.id),
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

      <Card className="border border-border p-5">
        <h2 className="text-lg font-bold text-text-primary">
          {editingAdId ? "แก้ไขโฆษณา" : "เพิ่มโฆษณา"}
        </h2>
        <div className="mt-4 space-y-3">
          <select
            value={adDraft.placement}
            onChange={(event) =>
              setAdDraft((prev) => ({
                ...prev,
                placement: event.target.value as AdPlacement,
              }))
            }
            className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
          >
            <option value="home_discover">{AD_PLACEMENT_LABELS.home_discover}</option>
            <option value="reader">{AD_PLACEMENT_LABELS.reader}</option>
          </select>
          <input
            value={adDraft.title}
            onChange={(event) =>
              setAdDraft((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="หัวข้อโฆษณา"
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
          />
          <textarea
            value={adDraft.body}
            onChange={(event) =>
              setAdDraft((prev) => ({ ...prev, body: event.target.value }))
            }
            rows={3}
            placeholder="รายละเอียดโฆษณา"
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={adDraft.ctaLabel}
              onChange={(event) =>
                setAdDraft((prev) => ({ ...prev, ctaLabel: event.target.value }))
              }
              placeholder="CTA"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
            />
            <input
              value={adDraft.href}
              onChange={(event) =>
                setAdDraft((prev) => ({ ...prev, href: event.target.value }))
              }
              placeholder="/discover"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
          <input
            value={adDraft.imageUrl}
            onChange={(event) =>
              setAdDraft((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
            placeholder="URL รูปภาพ"
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={adDraft.active}
              onChange={(event) =>
                setAdDraft((prev) => ({ ...prev, active: event.target.checked }))
              }
              className="accent-primary"
            />
            เปิดใช้งาน
          </label>
          <div className="overflow-hidden rounded-xl border border-border bg-accent">
            {/* eslint-disable-next-line @next/next/no-img-element -- Admin-managed mock ad URLs can be arbitrary. */}
            <img
              src={adDraft.imageUrl}
              alt="ตัวอย่างโฆษณา"
              className="h-32 w-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={submitAd}>
              {editingAdId ? <Save size={15} /> : <Plus size={15} />}
              {editingAdId ? "บันทึก" : "เพิ่มโฆษณา"}
            </Button>
            {editingAdId && (
              <Button variant="secondary" onClick={resetForm}>
                <X size={15} />
                ยกเลิก
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

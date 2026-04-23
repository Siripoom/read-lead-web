"use client";

export type AdPlacement = "home_discover" | "reader";

export interface CoinOffer {
  id: string;
  name: string;
  coins: number;
  price: number;
  label: string;
  highlight: boolean;
  active: boolean;
}

export interface EpisodePricePolicy {
  minCoins: number;
  maxCoins: number;
  recommendedCoins: number;
}

export interface AdCampaign {
  id: string;
  placement: AdPlacement;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  imageUrl: string;
  active: boolean;
}

export interface VipTier {
  id: string;
  level: number;
  name: string;
  title: string;
  minTopUpCoins: number;
  monthlyTickets: number;
}

export interface MonetizationSettings {
  coinOffers: CoinOffer[];
  episodePricePolicy: EpisodePricePolicy;
  ads: AdCampaign[];
  vipTiers: VipTier[];
}

export const MONETIZATION_STORAGE_KEY = "readlead_monetization_settings";

export const AD_PLACEMENT_LABELS: Record<AdPlacement, string> = {
  home_discover: "หน้าแรก / ค้นพบ",
  reader: "หน้าอ่านนิยาย",
};

export const DEFAULT_MONETIZATION_SETTINGS: MonetizationSettings = {
  coinOffers: [
    {
      id: "offer-50",
      name: "Starter",
      coins: 50,
      price: 15,
      label: "",
      highlight: false,
      active: true,
    },
    {
      id: "offer-100",
      name: "Reader",
      coins: 100,
      price: 25,
      label: "",
      highlight: false,
      active: true,
    },
    {
      id: "offer-200",
      name: "Best Value",
      coins: 200,
      price: 45,
      label: "Best Value",
      highlight: true,
      active: true,
    },
    {
      id: "offer-500",
      name: "Marathon",
      coins: 500,
      price: 99,
      label: "",
      highlight: false,
      active: true,
    },
    {
      id: "offer-1000",
      name: "Collector",
      coins: 1000,
      price: 179,
      label: "",
      highlight: false,
      active: true,
    },
    {
      id: "offer-2000",
      name: "Premium",
      coins: 2000,
      price: 299,
      label: "Premium",
      highlight: false,
      active: true,
    },
  ],
  episodePricePolicy: {
    minCoins: 1,
    maxCoins: 30,
    recommendedCoins: 3,
  },
  ads: [
    {
      id: "ad-home-spotlight",
      placement: "home_discover",
      title: "อ่านแฟนตาซีชุดใหม่วันนี้",
      body: "รับโบนัสเหรียญเมื่อเติมแพ็ก 200 coins แล้วปลดล็อกตอนพรีเมียม",
      ctaLabel: "ดูโปรโมชัน",
      href: "/dashboard",
      imageUrl: "https://placehold.co/960x240/E11D2E/white?text=ReadLead+Promo",
      active: true,
    },
    {
      id: "ad-reader-unlock",
      placement: "reader",
      title: "ปลดล็อกตอนถัดไปได้ต่อเนื่อง",
      body: "แพ็กเหรียญแนะนำสำหรับสายอ่านยาว พร้อมโปรโมชันประจำสัปดาห์",
      ctaLabel: "เติมเหรียญ",
      href: "/dashboard",
      imageUrl: "https://placehold.co/720x160/111827/white?text=Reader+Offer",
      active: true,
    },
  ],
  vipTiers: [
    {
      id: "vip-bronze",
      level: 1,
      name: "Bronze Reader",
      title: "นักอ่านหน้าใหม่",
      minTopUpCoins: 100,
      monthlyTickets: 3,
    },
    {
      id: "vip-silver",
      level: 2,
      name: "Silver Reader",
      title: "นักอ่านผู้สนับสนุน",
      minTopUpCoins: 500,
      monthlyTickets: 10,
    },
    {
      id: "vip-gold",
      level: 3,
      name: "Gold Reader",
      title: "ผู้อุปถัมภ์นิยาย",
      minTopUpCoins: 1000,
      monthlyTickets: 25,
    },
  ],
};

function cloneDefaultSettings() {
  return JSON.parse(
    JSON.stringify(DEFAULT_MONETIZATION_SETTINGS)
  ) as MonetizationSettings;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function createMonetizationId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeEpisodePricePolicy(
  policy: Partial<EpisodePricePolicy> | undefined
): EpisodePricePolicy {
  const fallback = DEFAULT_MONETIZATION_SETTINGS.episodePricePolicy;
  const rawMinCoins = policy?.minCoins;
  const rawMaxCoins = policy?.maxCoins;
  const rawRecommendedCoins = policy?.recommendedCoins;
  const minSource = isFiniteNumber(rawMinCoins) ? rawMinCoins : fallback.minCoins;
  const maxSource = isFiniteNumber(rawMaxCoins) ? rawMaxCoins : fallback.maxCoins;
  const recommendedSource = isFiniteNumber(rawRecommendedCoins)
    ? rawRecommendedCoins
    : fallback.recommendedCoins;
  const minCoins = Math.max(
    0,
    Math.floor(minSource)
  );
  const maxCoins = Math.max(
    minCoins,
    Math.floor(maxSource)
  );
  const recommendedCoins = Math.min(
    maxCoins,
    Math.max(minCoins, Math.floor(recommendedSource))
  );

  return { minCoins, maxCoins, recommendedCoins };
}

export function loadMonetizationSettings(): MonetizationSettings {
  if (typeof window === "undefined") return cloneDefaultSettings();

  try {
    const raw = window.localStorage.getItem(MONETIZATION_STORAGE_KEY);
    if (!raw) return cloneDefaultSettings();

    const parsed = JSON.parse(raw) as Partial<MonetizationSettings>;
    const fallback = cloneDefaultSettings();

    return {
      coinOffers: Array.isArray(parsed.coinOffers)
        ? parsed.coinOffers
            .filter(
              (offer): offer is CoinOffer =>
                typeof offer?.id === "string" &&
                typeof offer.name === "string" &&
                isFiniteNumber(offer.coins) &&
                isFiniteNumber(offer.price)
            )
            .map((offer) => ({
              ...offer,
              coins: Math.max(0, Math.floor(offer.coins)),
              price: Math.max(0, offer.price),
              label: typeof offer.label === "string" ? offer.label : "",
              highlight: Boolean(offer.highlight),
              active: Boolean(offer.active),
            }))
        : fallback.coinOffers,
      episodePricePolicy: normalizeEpisodePricePolicy(parsed.episodePricePolicy),
      ads: Array.isArray(parsed.ads)
        ? parsed.ads
            .filter(
              (ad): ad is AdCampaign =>
                typeof ad?.id === "string" &&
                (ad.placement === "home_discover" || ad.placement === "reader") &&
                typeof ad.title === "string" &&
                typeof ad.body === "string" &&
                typeof ad.ctaLabel === "string" &&
                typeof ad.href === "string" &&
                typeof ad.imageUrl === "string"
            )
            .map((ad) => ({ ...ad, active: Boolean(ad.active) }))
        : fallback.ads,
      vipTiers: Array.isArray(parsed.vipTiers)
        ? parsed.vipTiers
            .filter(
              (tier): tier is VipTier =>
                typeof tier?.id === "string" &&
                isFiniteNumber(tier.level) &&
                typeof tier.name === "string" &&
                typeof tier.title === "string" &&
                isFiniteNumber(tier.minTopUpCoins) &&
                isFiniteNumber(tier.monthlyTickets)
            )
            .map((tier) => ({
              ...tier,
              level: Math.max(1, Math.floor(tier.level)),
              minTopUpCoins: Math.max(0, Math.floor(tier.minTopUpCoins)),
              monthlyTickets: Math.max(0, Math.floor(tier.monthlyTickets)),
            }))
            .sort((left, right) => left.minTopUpCoins - right.minTopUpCoins)
        : fallback.vipTiers,
    };
  } catch {
    window.localStorage.removeItem(MONETIZATION_STORAGE_KEY);
    return cloneDefaultSettings();
  }
}

export function saveMonetizationSettings(settings: MonetizationSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MONETIZATION_STORAGE_KEY, JSON.stringify(settings));
}

export function loadEpisodePricePolicy() {
  return loadMonetizationSettings().episodePricePolicy;
}

export function getActiveCoinOffers() {
  return loadMonetizationSettings().coinOffers.filter((offer) => offer.active);
}

export function getActiveAds(placement: AdPlacement) {
  return loadMonetizationSettings().ads.filter(
    (ad) => ad.placement === placement && ad.active
  );
}

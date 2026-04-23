"use client";

import {
  loadMonetizationSettings,
  type VipTier,
} from "@/lib/monetization";
import { spendCoins } from "@/lib/coins";

export const VIP_STATE_STORAGE_KEY = "readlead_vip_state";

export interface VipState {
  totalTopUpCoins: number;
  dailyTicketDate: string;
  dailyTickets: number;
  monthlyTickets: number;
  votesByStory: Record<string, number>;
  donationsByStory: Record<string, number>;
}

export interface DonationResult {
  ok: boolean;
  remainingCoins: number | null;
}

const DEFAULT_VIP_STATE: VipState = {
  totalTopUpCoins: 0,
  dailyTicketDate: "",
  dailyTickets: 1,
  monthlyTickets: 0,
  votesByStory: {},
  donationsByStory: {},
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function cloneDefaultState(): VipState {
  return JSON.parse(JSON.stringify(DEFAULT_VIP_STATE)) as VipState;
}

export function getVipTier(totalTopUpCoins: number, tiers = loadMonetizationSettings().vipTiers) {
  return [...tiers]
    .sort((left, right) => left.minTopUpCoins - right.minTopUpCoins)
    .filter((tier) => totalTopUpCoins >= tier.minTopUpCoins)
    .at(-1);
}

export function loadVipState(): VipState {
  if (typeof window === "undefined") return cloneDefaultState();

  try {
    const raw = window.localStorage.getItem(VIP_STATE_STORAGE_KEY);
    const state = raw ? (JSON.parse(raw) as Partial<VipState>) : cloneDefaultState();
    const today = todayKey();

    return {
      totalTopUpCoins:
        typeof state.totalTopUpCoins === "number" ? state.totalTopUpCoins : 0,
      dailyTicketDate: state.dailyTicketDate === today ? today : today,
      dailyTickets:
        state.dailyTicketDate === today && typeof state.dailyTickets === "number"
          ? state.dailyTickets
          : 1,
      monthlyTickets:
        typeof state.monthlyTickets === "number" ? Math.max(0, state.monthlyTickets) : 0,
      votesByStory:
        state.votesByStory && typeof state.votesByStory === "object"
          ? state.votesByStory
          : {},
      donationsByStory:
        state.donationsByStory && typeof state.donationsByStory === "object"
          ? state.donationsByStory
          : {},
    };
  } catch {
    window.localStorage.removeItem(VIP_STATE_STORAGE_KEY);
    return cloneDefaultState();
  }
}

export function saveVipState(state: VipState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VIP_STATE_STORAGE_KEY, JSON.stringify(state));
}

export function applyVipTopUp(coins: number) {
  const state = loadVipState();
  const tiers = loadMonetizationSettings().vipTiers;
  const nextTotal = state.totalTopUpCoins + Math.max(0, coins);
  const nextTier = getVipTier(nextTotal, tiers);
  const nextState: VipState = {
    ...state,
    totalTopUpCoins: nextTotal,
    monthlyTickets: state.monthlyTickets + (nextTier?.monthlyTickets ?? 0),
  };

  saveVipState(nextState);
  return nextState;
}

export function castStoryVote(storyId: string, ticketType: "daily" | "monthly") {
  const state = loadVipState();

  if (ticketType === "daily") {
    if (state.dailyTickets <= 0) return state;
    state.dailyTickets -= 1;
  } else {
    if (state.monthlyTickets <= 0) return state;
    state.monthlyTickets -= 1;
  }

  state.votesByStory[storyId] = (state.votesByStory[storyId] ?? 0) + 1;
  saveVipState(state);
  return state;
}

export function donateToStory(storyId: string, amount: number): DonationResult {
  const safeAmount = Math.max(0, Math.floor(amount));
  const remainingCoins = spendCoins(safeAmount);
  if (remainingCoins === null) return { ok: false, remainingCoins };

  const state = loadVipState();
  state.donationsByStory[storyId] = (state.donationsByStory[storyId] ?? 0) + safeAmount;
  saveVipState(state);

  return { ok: true, remainingCoins };
}

export function formatVipTier(tier: VipTier | undefined) {
  if (!tier) return "ยังไม่มีระดับ VIP";
  return `VIP ${tier.level} · ${tier.name} · ${tier.title}`;
}

const COINS_KEY = "readlead_coins";
const UNLOCKED_KEY = "readlead_unlocked_chapters";

const INITIAL_COINS = 10; // default balance for testing

export function getCoins(): number {
  if (typeof window === "undefined") return INITIAL_COINS;
  const stored = localStorage.getItem(COINS_KEY);
  if (stored === null) {
    localStorage.setItem(COINS_KEY, String(INITIAL_COINS));
    return INITIAL_COINS;
  }
  return Number(stored);
}

export function saveCoins(amount: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COINS_KEY, String(Math.max(0, amount)));
}

export function addCoins(amount: number): number {
  const next = getCoins() + amount;
  saveCoins(next);
  return next;
}

export function spendCoins(amount: number): number | null {
  const current = getCoins();
  if (current < amount) return null; // insufficient
  const next = current - amount;
  saveCoins(next);
  return next;
}

export function getUnlockedChapters(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(UNLOCKED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function unlockChapter(chapterId: number): void {
  if (typeof window === "undefined") return;
  const current = getUnlockedChapters();
  if (!current.includes(chapterId)) {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...current, chapterId]));
  }
}

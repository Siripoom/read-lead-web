import { Home, Compass, User, PenLine, Shield, BarChart2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Role = "guest" | "user" | "creator" | "admin";

export const ROLE_KEY = "readlead_role";
export const DEFAULT_ROLE: Role = "guest";

export function getStoredRole(): Role {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  const stored = localStorage.getItem(ROLE_KEY);
  const valid: Role[] = ["guest", "user", "creator", "admin"];
  return valid.includes(stored as Role) ? (stored as Role) : DEFAULT_ROLE;
}

export function setStoredRole(role: Role): void {
  localStorage.setItem(ROLE_KEY, role);
}

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: "/", icon: Home, label: "หน้าหลัก" },
  { href: "/discover", icon: Compass, label: "ค้นพบ" },
  { href: "/dashboard", icon: User, label: "ห้องสมุดของฉัน" },
  { href: "/creator", icon: PenLine, label: "สตูดิโอนักเขียน" },
  { href: "/admin", icon: Shield, label: "แผงผู้ดูแล" },
  { href: "/finance", icon: BarChart2, label: "การเงิน" },
];

export const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  guest: ALL_NAV_ITEMS.slice(0, 2),
  user: ALL_NAV_ITEMS.slice(0, 3),
  creator: ALL_NAV_ITEMS.slice(0, 4),
  admin: ALL_NAV_ITEMS.slice(4),
};

const TOP_NAV_ITEMS: Record<"home" | "discover" | "library" | "creator", NavItem> = {
  home: { href: "/", icon: Home, label: "หน้าหลัก" },
  discover: { href: "/discover", icon: Compass, label: "ค้นพบ" },
  library: { href: "/dashboard", icon: User, label: "ห้องสมุดของฉัน" },
  creator: { href: "/creator?tab=works", icon: PenLine, label: "จัดการนิยาย" },
};

export const TOP_NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  guest: [TOP_NAV_ITEMS.home, TOP_NAV_ITEMS.discover],
  user: [TOP_NAV_ITEMS.home, TOP_NAV_ITEMS.discover, TOP_NAV_ITEMS.library],
  creator: [TOP_NAV_ITEMS.home, TOP_NAV_ITEMS.discover, TOP_NAV_ITEMS.creator],
  admin: [],
};

export const ROLE_LABELS: Record<Role, string> = {
  guest: "ผู้อ่านทั่วไป",
  user: "สมาชิก",
  creator: "นักเขียน",
  admin: "ผู้ดูแลระบบ",
};

export const ROLE_COLORS: Record<Role, string> = {
  guest: "bg-gray-100 text-gray-600",
  user: "bg-blue-100 text-blue-700",
  creator: "bg-purple-100 text-purple-700",
  admin: "bg-primary-light text-primary",
};

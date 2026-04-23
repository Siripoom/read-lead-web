"use client";

import Link from "next/link";
import SidebarNavItem from "./SidebarNavItem";
import { useRole } from "@/context/RoleContext";
import { NAV_ITEMS_BY_ROLE, ROLE_LABELS, ROLE_COLORS } from "@/lib/roles";

export default function Sidebar() {
  const { role } = useRole();
  const navItems = NAV_ITEMS_BY_ROLE[role];
  const roleLabel = ROLE_LABELS[role];
  const roleBadgeClass = ROLE_COLORS[role];

  return (
    <aside
      className="w-[240px] shrink-0 h-screen bg-white border-r border-border flex flex-col sticky top-0"
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 2h5v12H2zM9 2h5v12H9z" fill="white" opacity="0.9" />
            </svg>
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight">
            ReadLead
          </span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light border-2 border-white shadow-sm flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">
              {role === "guest"
                ? "G"
                : role === "admin"
                  ? "A"
                  : role === "creator"
                    ? "C"
                    : "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {roleLabel}
            </p>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 capitalize ${roleBadgeClass}`}
              data-testid="sidebar-role-badge"
            >
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" data-testid="sidebar-nav">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      {/* Upgrade Banner — only for Guest and User */}
      {/* {showUpgrade && (
        <div className="px-4 py-4 border-t border-border">
          <div className="bg-primary-light rounded-xl p-3 text-center">
            <Star size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs font-semibold text-primary mb-1">อัปเกรดเป็น Pro</p>
            <p className="text-xs text-primary/70 mb-2">อ่านได้ไม่จำกัด</p>
            <button className="w-full bg-primary text-white text-xs font-medium py-1.5 rounded-lg hover:bg-primary-hover transition-colors">
              รับ Pro
            </button>
          </div>
        </div>
      )} */}

      {/* Settings */}
      {/* <div className="px-3 pb-4 border-t border-border pt-3">
        <SidebarNavItem href="/settings" icon={Settings} label="ตั้งค่า" />
      </div> */}
    </aside>
  );
}

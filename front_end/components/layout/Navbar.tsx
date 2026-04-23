"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import Avatar from "@/components/ui/Avatar";
import { useRole } from "@/context/RoleContext";
import { CATEGORY_MENU_ITEMS, getCategoryHref } from "@/lib/categories";
import { ROLE_LABELS, TOP_NAV_ITEMS_BY_ROLE } from "@/lib/roles";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { role, isLoggedIn } = useRole();
  const pathname = usePathname();
  const navItems = TOP_NAV_ITEMS_BY_ROLE[role];
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const showBrowseMenus = role === "guest" || role === "user";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!categoryMenuRef.current) return;
      if (categoryMenuRef.current.contains(event.target as Node)) return;
      setIsCategoryOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header
      className="h-16 glass border-b border-border/50 sticky top-0 z-30 flex items-center justify-between px-6 gap-4"
      data-testid="navbar"
    >
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hrefPath = item.href.split("?")[0];
          const isActive = pathname === hrefPath;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsCategoryOpen(false)}
              data-testid={`navbar-nav-item-${hrefPath === "/" ? "home" : hrefPath.replace("/", "")}`}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {showBrowseMenus && (
          <span className="w-px h-4 bg-border" aria-hidden="true" />
        )}

        {showBrowseMenus && (
          <>
            <div className="relative" ref={categoryMenuRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen((open) => !open)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isCategoryOpen
                    ? "border-primary/40 bg-primary-light text-primary"
                    : "border-border bg-white text-text-muted hover:text-text-primary hover:border-primary/40"
                )}
                aria-haspopup="menu"
                aria-expanded={isCategoryOpen}
                aria-controls="category-dropdown-menu"
              >
                หมวดหมู่
                <ChevronDown
                  size={15}
                  className={cn("transition-transform", isCategoryOpen && "rotate-180")}
                />
              </button>

              {isCategoryOpen && (
                <div
                  id="category-dropdown-menu"
                  className="absolute top-full left-0 mt-3 z-50 w-[820px] max-w-[calc(100vw-3rem)] rounded-2xl border border-border bg-white p-4 shadow-xl"
                  role="menu"
                  aria-label="เมนูหมวดหมู่"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
                    {CATEGORY_MENU_ITEMS.map((category) => (
                      <Link
                        key={category}
                        href={getCategoryHref(category)}
                        className={cn(
                          "rounded-xl border border-transparent px-3 py-2 text-sm font-semibold leading-none transition-colors",
                          category === "ทุกหมวดหมู่"
                            ? "bg-primary-light text-primary hover:border-primary/30"
                            : "text-text-muted hover:border-primary/30 hover:bg-primary-light hover:text-primary"
                        )}
                        onClick={() => setIsCategoryOpen(false)}
                        role="menuitem"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/discover?genre=novel" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors">นิยาย</Link>
            <Link href="/discover?genre=manga" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors">มังงะ</Link>
            <Link href="/discover?genre=audiobook" onClick={() => setIsCategoryOpen(false)} className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors">หนังสือเสียง</Link>
          </>
        )}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          /* Logged-in: show notifications + avatar */
          <div className="flex items-center gap-2" data-testid="navbar-user-info">
            <NotificationDropdown />
            <Avatar alt={ROLE_LABELS[role]} size={32} />
            <span className="hidden md:block text-sm font-medium text-text-primary">
              {ROLE_LABELS[role]}
            </span>
          </div>
        ) : (
          /* Guest: show Login + Sign Up */
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              data-testid="navbar-login-link"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="bg-primary text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-primary-hover transition-colors"
              data-testid="navbar-signup-link"
            >
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

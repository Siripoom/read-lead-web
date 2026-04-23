"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function SidebarNavItem({ href, icon: Icon, label }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const testId = `sidebar-nav-item-${href.replace(/\//g, "") || "home"}`;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary-light text-primary"
          : "text-text-muted hover:bg-accent hover:text-text-primary"
      )}
      data-testid={testId}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { ShieldOff } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import type { Role } from "@/lib/roles";

interface RouteGuardProps {
  allowed: Role[];
  children: React.ReactNode;
}

export default function RouteGuard({ allowed, children }: RouteGuardProps) {
  const { role } = useRole();

  if (!allowed.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 p-8 text-center" data-testid="route-guard-denied">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
          <ShieldOff size={28} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Access Denied</h2>
          <p className="text-sm text-text-muted max-w-xs">
            Your current role (<span className="font-semibold capitalize">{role}</span>) does not have permission to view this page.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-primary-hover transition-colors"
            data-testid="route-guard-go-home"
          >
            Go Home
          </Link>
          <p className="flex items-center text-xs text-text-muted">
            Use the role switcher (bottom-right) to change role.
          </p>
        </div>
      </div>
    );
  }

  return <div data-testid="route-guard-authorized">{children}</div>;
}

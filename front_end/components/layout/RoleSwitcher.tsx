"use client";

import { useRole } from "@/context/RoleContext";
import type { Role } from "@/lib/roles";

const ROLES: { value: Role; label: string }[] = [
  { value: "guest", label: "Guest" },
  { value: "user", label: "User" },
  { value: "creator", label: "Creator" },
  { value: "admin", label: "Admin" },
];

export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 bg-white rounded-full shadow-lg border border-border px-2 py-1.5">
      <span className="text-xs font-semibold text-text-muted pl-1 pr-2 border-r border-border mr-1">
        Role
      </span>
      {ROLES.map((r) => (
        <button
          key={r.value}
          onClick={() => setRole(r.value)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
            role === r.value
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text-primary hover:bg-accent"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

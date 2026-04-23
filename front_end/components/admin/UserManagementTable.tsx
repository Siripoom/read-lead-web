"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";

const USERS = [
  { id: "u1", name: "BookLover99", email: "bl99@mail.com", role: "Reader", status: "active" as const, joined: "Jan 10, 2026" },
  { id: "u2", name: "Elara Vane", email: "elarav@mail.com", role: "Creator", status: "active" as const, joined: "Dec 5, 2025" },
  { id: "u3", name: "Spam User", email: "spam@bad.com", role: "Reader", status: "pending" as const, joined: "Mar 19, 2026" },
];

export default function UserManagementTable() {
  const [users, setUsers] = useState(USERS);

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-accent/50">
          <tr>
            {["User", "Email", "Role", "Status", "Joined", "Action"].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-text-muted px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className={`hover:bg-accent/30 transition-colors ${i < users.length - 1 ? "border-b border-border" : ""}`}>
              <td className="px-5 py-3.5 font-medium text-text-primary">{u.name}</td>
              <td className="px-5 py-3.5 text-text-muted">{u.email}</td>
              <td className="px-5 py-3.5 text-text-muted">{u.role}</td>
              <td className="px-5 py-3.5"><Badge variant={u.status === "active" ? "approved" : "pending"}>{u.status}</Badge></td>
              <td className="px-5 py-3.5 text-text-muted">{u.joined}</td>
              <td className="px-5 py-3.5">
                <button
                  onClick={() => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === "active" ? "pending" : "active" } : x))}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${u.status === "active" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                >
                  {u.status === "active" ? "Ban" : "Unban"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

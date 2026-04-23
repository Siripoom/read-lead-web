"use client";

import { useState } from "react";
import { Bell, BookOpen, MessageCircle, ShoppingBag, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import type { Notification } from "@/lib/mock-data";

const typeIcon = {
  new_episode: BookOpen,
  comment: MessageCircle,
  purchase: ShoppingBag,
  system: Info,
};

const typeRoute: Record<Notification["type"], string> = {
  new_episode: "/detail",
  comment: "/detail",
  purchase: "/dashboard",
  system: "/dashboard",
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const router = useRouter();

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleClick(n: Notification) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    setOpen(false);
    router.push(typeRoute[n.type]);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-full bg-accent hover:bg-border transition-colors flex items-center justify-center cursor-pointer"
      >
        <Bell size={18} className="text-text-muted" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 w-80 glass rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <p className="font-semibold text-sm text-text-primary">การแจ้งเตือน</p>
              {unread > 0 && (
                <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">
                  {unread} ใหม่
                </span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = typeIcon[n.type];
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left ${!n.read ? "bg-primary-light/30" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary leading-snug">{n.message}</p>
                      <p className="text-xs text-text-muted mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2 border-t border-border/50 flex items-center justify-between">
              <button
                onClick={markAllRead}
                disabled={unread === 0}
                className="text-xs text-primary font-medium hover:underline disabled:opacity-40 disabled:cursor-default"
              >
                ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
              </button>
              <button
                onClick={() => { setOpen(false); router.push("/notifications"); }}
                className="text-xs text-text-muted hover:text-text-primary font-medium"
              >
                ดูทั้งหมด
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { Check, X, EyeOff } from "lucide-react";

type ItemStatus = "pending" | "approved" | "rejected" | "unpublished";
type ItemGenre = "manga" | "novel" | "audiobook";

interface ContentItem {
  id: string;
  title: string;
  author: string;
  genre: ItemGenre;
  submitted: string;
  status: ItemStatus;
}

const INITIAL_ITEMS: ContentItem[] = [
  { id: "1", title: "Shadow Walker", author: "Tom Reed", genre: "manga", submitted: "Mar 20, 2026", status: "pending" },
  { id: "2", title: "The Glass Sea", author: "Amy Lox", genre: "novel", submitted: "Mar 19, 2026", status: "pending" },
  { id: "3", title: "Wired Dreams", author: "Jin Park", genre: "audiobook", submitted: "Mar 18, 2026", status: "pending" },
  { id: "4", title: "The Obsidian Chronicles", author: "Elara Vane", genre: "novel", submitted: "Jan 10, 2026", status: "approved" },
  { id: "5", title: "Neon Ghost", author: "Yuki Tanaka", genre: "manga", submitted: "Feb 5, 2026", status: "approved" },
];

export default function ContentApprovalTable() {
  const [items, setItems] = useState<ContentItem[]>(INITIAL_ITEMS);

  function handle(id: string, action: "approved" | "rejected" | "unpublished") {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: action } : i));
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-accent/50">
          <tr>
            {["Title", "Author", "Genre", "Submitted", "Status", "Actions"].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-text-muted px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} className={`hover:bg-accent/30 transition-colors ${i < items.length - 1 ? "border-b border-border" : ""}`}>
              <td className="px-5 py-3.5 font-medium text-text-primary">{item.title}</td>
              <td className="px-5 py-3.5 text-text-muted">{item.author}</td>
              <td className="px-5 py-3.5"><Badge variant={item.genre}>{item.genre}</Badge></td>
              <td className="px-5 py-3.5 text-text-muted">{item.submitted}</td>
              <td className="px-5 py-3.5">
                <Badge variant={item.status}>{item.status}</Badge>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex gap-2">
                  {item.status === "pending" && (
                    <>
                      <button
                        onClick={() => handle(item.id, "approved")}
                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="Approve"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => handle(item.id, "rejected")}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        title="Reject"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  {item.status === "approved" && (
                    <button
                      onClick={() => handle(item.id, "unpublished")}
                      className="p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
                      title="Unpublish"
                    >
                      <EyeOff size={14} />
                    </button>
                  )}
                  {item.status === "unpublished" && (
                    <button
                      onClick={() => handle(item.id, "approved")}
                      className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="Re-publish"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

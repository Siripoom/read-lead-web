"use client";

import { useState } from "react";
import { Eye, Edit2, Send } from "lucide-react";
import Badge from "@/components/ui/Badge";
import NewStoryModal from "./NewStoryModal";
import EditStoryModal from "./EditStoryModal";
import { MOCK_WORKS } from "@/lib/mock-data";
import type { Work } from "@/lib/mock-data";

export default function WorksList() {
  const [works, setWorks] = useState<Work[]>(MOCK_WORKS);
  const [showNew, setShowNew] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);

  function handleCreated(work: Work) {
    setWorks((prev) => [work, ...prev]);
  }

  function handleSaved(updated: Work) {
    setWorks((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  }

  function handleSubmit(id: string) {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "pending" as Work["status"] } : w))
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-bold text-text-primary">My Works</h3>
          <button
            onClick={() => setShowNew(true)}
            className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-primary-hover transition-colors"
          >
            + New Story
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-accent/50">
            <tr>
              {["Title", "Genre", "Episodes", "Reads", "Revenue", "Status", ""].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-text-muted px-5 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {works.map((w, i) => (
              <tr key={w.id} className={`hover:bg-accent/30 transition-colors ${i < works.length - 1 ? "border-b border-border" : ""}`}>
                <td className="px-5 py-3.5 font-medium text-text-primary">{w.title}</td>
                <td className="px-5 py-3.5"><Badge variant={w.genre}>{w.genre}</Badge></td>
                <td className="px-5 py-3.5 text-text-muted">{w.episodes}</td>
                <td className="px-5 py-3.5 text-text-muted">{w.reads}</td>
                <td className="px-5 py-3.5 font-semibold text-text-primary">฿{w.revenue.toLocaleString()}</td>
                <td className="px-5 py-3.5"><Badge variant={w.status}>{w.status}</Badge></td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-accent text-text-muted hover:text-text-primary transition-colors" title="Preview">
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => setEditingWork(w)}
                      className="p-1.5 rounded-lg hover:bg-accent text-text-muted hover:text-text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    {w.status === "draft" && (
                      <button
                        onClick={() => handleSubmit(w.id)}
                        className="p-1.5 rounded-lg hover:bg-primary-light text-text-muted hover:text-primary transition-colors"
                        title="Submit for Review"
                      >
                        <Send size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <NewStoryModal onClose={() => setShowNew(false)} onCreated={handleCreated} />
      )}
      {editingWork && (
        <EditStoryModal
          work={editingWork}
          onClose={() => setEditingWork(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}

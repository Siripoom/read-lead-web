"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import type { Work } from "@/lib/mock-data";

interface Props {
  work: Work;
  onClose: () => void;
  onSaved: (updated: Work) => void;
}

export default function EditStoryModal({ work, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(work.title);
  const [genre, setGenre] = useState<Work["genre"]>(work.genre);
  const [synopsis, setSynopsis] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSave(newStatus?: Work["status"]) {
    if (!title.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onSaved({ ...work, title: title.trim(), genre, status: newStatus ?? work.status });
      onClose();
    }, 600);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-text-primary">Edit Story</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Story Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as Work["genre"])}
              className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            >
              <option value="novel">Novel</option>
              <option value="manga">Manga</option>
              <option value="audiobook">Audiobook</option>
            </select>
          </div>

          {/* Synopsis */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Synopsis</label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Story description..."
              rows={4}
              className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Cover Upload */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Cover Image</label>
            <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload size={20} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-text-muted">Upload new cover</p>
              <p className="text-xs text-text-muted mt-0.5">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Status info */}
          <div className="bg-accent rounded-xl px-4 py-3 text-sm">
            <span className="text-text-muted">Current status: </span>
            <span className="font-semibold text-text-primary capitalize">{work.status}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-5 pt-4 border-t border-border flex-wrap">
          {work.status === "published" && (
            <button
              onClick={() => handleSave("draft")}
              disabled={loading}
              className="border border-red-200 text-red-600 text-sm font-medium py-2.5 px-4 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Unpublish
            </button>
          )}
          {work.status === "draft" && (
            <button
              onClick={() => handleSave("pending")}
              disabled={loading}
              className="border border-primary text-primary text-sm font-medium py-2.5 px-4 rounded-full hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              Submit for Review
            </button>
          )}
          <button
            onClick={onClose}
            className="border border-border text-text-primary text-sm font-medium py-2.5 px-4 rounded-full hover:bg-accent transition-colors ml-auto"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave()}
            disabled={loading || !title.trim()}
            className="bg-primary text-white text-sm font-semibold py-2.5 px-6 rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

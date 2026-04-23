"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import type { Work } from "@/lib/mock-data";

type SubmitStatus = "draft" | "pending";

interface Props {
  onClose: () => void;
  onCreated: (work: Work) => void;
}

export default function NewStoryModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<Work["genre"]>("novel");
  const [synopsis, setSynopsis] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [rating, setRating] = useState("general");
  const [loading, setLoading] = useState(false);

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInput.trim().replace(/,$/, "");
      if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  }

  function removeTag(t: string) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  function handleSubmit(status: SubmitStatus) {
    if (!title.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const newWork: Work = {
        id: `wk${Date.now()}`,
        title: title.trim(),
        genre,
        episodes: 0,
        reads: "0",
        status,
        revenue: 0,
      };
      onCreated(newWork);
      onClose();
    }, 600);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-text-primary">Create New Story</h2>
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
              placeholder="Story title..."
              className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Genre + Rating */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Content Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              >
                <option value="general">General</option>
                <option value="teen">Teen</option>
                <option value="mature">Mature</option>
              </select>
            </div>
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

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type tag and press Enter..."
              className="mt-1.5 w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full">
                    {t}
                    <button onClick={() => removeTag(t)} className="hover:text-primary-hover">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover Upload */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Cover Image</label>
            <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload size={20} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-text-muted">Upload cover image</p>
              <p className="text-xs text-text-muted mt-0.5">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-5 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="border border-border text-text-primary text-sm font-medium py-2.5 px-4 rounded-full hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading || !title.trim()}
            className="flex-1 border border-border text-text-primary text-sm font-medium py-2.5 rounded-full hover:bg-accent transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("pending")}
            disabled={loading || !title.trim()}
            className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

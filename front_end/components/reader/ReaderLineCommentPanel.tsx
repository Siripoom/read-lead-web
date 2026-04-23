"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import type { LineComment, SelectedLine } from "@/app/reader/page";

interface ReaderLineCommentPanelProps {
  theme: "dark" | "light";
  line: SelectedLine;
  comments: LineComment[];
  onClose: () => void;
  onSubmit: (text: string) => void;
}

function formatCommentDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ReaderLineCommentPanel({
  theme,
  line,
  comments,
  onClose,
  onSubmit,
}: ReaderLineCommentPanelProps) {
  const dark = theme === "dark";
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [line.chapterId, line.lineIndex]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) return;

    onSubmit(trimmedDraft);
    setDraft("");
  };

  return (
    <>
      <button
        type="button"
        aria-label="ปิดคอมเมนต์"
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-black/35 lg:hidden"
      />

      <aside
        data-testid="reader-line-comment-panel"
        className={`fixed inset-x-0 bottom-0 z-[80] flex max-h-[82vh] flex-col rounded-t-2xl border-t shadow-2xl lg:inset-x-auto lg:bottom-6 lg:right-4 lg:top-20 lg:w-[380px] lg:max-h-none lg:rounded-2xl lg:border ${
          dark
            ? "border-white/10 bg-dark-surface text-white"
            : "border-border bg-white text-text-primary"
        }`}
      >
        <div
          className={`flex items-center gap-3 border-b px-5 py-4 ${
            dark ? "border-white/10" : "border-border"
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              dark ? "bg-primary/20 text-primary" : "bg-primary-light text-primary"
            }`}
          >
            <MessageCircle size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">คอมเมนต์บรรทัดนี้</p>
            <p
              data-testid="reader-line-comment-count"
              className={dark ? "text-xs text-white/45" : "text-xs text-text-muted"}
            >
              {comments.length} คอมเมนต์
            </p>
          </div>
          <button
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className={`rounded-full p-2 transition-colors ${
              dark
                ? "text-white/55 hover:bg-white/10 hover:text-white"
                : "text-text-muted hover:bg-accent hover:text-text-primary"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <blockquote
            className={`rounded-lg border-l-4 px-4 py-3 text-sm leading-relaxed ${
              dark
                ? "border-primary bg-white/5 text-white/75"
                : "border-primary bg-accent text-text-primary/75"
            }`}
          >
            {line.lineText}
          </blockquote>

          <div className="mt-5 space-y-3">
            {comments.length === 0 ? (
              <p
                className={`rounded-lg border border-dashed px-4 py-5 text-center text-sm ${
                  dark
                    ? "border-white/10 text-white/45"
                    : "border-border text-text-muted"
                }`}
              >
                ยังไม่มีคอมเมนต์สำหรับบรรทัดนี้
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {comment.avatarLabel}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{comment.user}</p>
                      <span
                        className={`text-[11px] ${
                          dark ? "text-white/35" : "text-text-muted"
                        }`}
                      >
                        {formatCommentDate(comment.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        dark ? "text-white/70" : "text-text-primary/75"
                      }`}
                    >
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`border-t p-4 ${dark ? "border-white/10" : "border-border"}`}
        >
          <textarea
            ref={textareaRef}
            data-testid="reader-line-comment-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="เขียนคอมเมนต์..."
            className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors ${
              dark
                ? "border-white/10 bg-black/20 text-white placeholder:text-white/30 focus:border-primary"
                : "border-border bg-white text-text-primary placeholder:text-text-muted focus:border-primary"
            }`}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              data-testid="reader-line-comment-submit"
              disabled={draft.trim().length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-primary/35"
            >
              ส่ง <Send size={14} />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

"use client";

import { forwardRef, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Lock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Coins,
  MessageCircle,
} from "lucide-react";
import type { Chapter } from "@/app/reader/page";

interface ReaderContentProps {
  theme: "dark" | "light";
  fontSize: number;
  chapter: Chapter;
  chapters: Chapter[];
  currentIndex: number;
  coins: number;
  lines: string[];
  selectedLineIndex: number | null;
  lineCommentCounts: Record<number, number>;
  commentsVisible: boolean;
  isChapterAccessible: (chapter: Chapter) => boolean;
  onNavigate: (index: number) => void;
  onAtBottom: (isAtBottom: boolean) => void;
  onSelectLine: (lineIndex: number, lineText: string) => void;
}

function ChapterCostLabel({
  chapter,
  className = "",
}: {
  chapter: Chapter;
  className?: string;
}) {
  if (chapter.activePromotion && chapter.originalCost) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="line-through opacity-60">
          {chapter.originalCost} เหรียญ
        </span>
        <span>{chapter.cost} เหรียญ</span>
        <span>ลด {chapter.activePromotion.discountPercent}%</span>
      </span>
    );
  }

  return <span className={className}>{chapter.cost} เหรียญ</span>;
}

const ReaderContent = forwardRef<HTMLDivElement, ReaderContentProps>(
  function ReaderContent(
    {
      theme,
      fontSize,
      chapter,
      chapters,
      currentIndex,
      coins,
      lines,
      selectedLineIndex,
      lineCommentCounts,
      commentsVisible,
      isChapterAccessible,
      onNavigate,
      onAtBottom,
      onSelectLine,
    },
    ref
  ) {
    const dark = theme === "dark";
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Detect when reader reaches the very bottom
    useEffect(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        ([entry]) => onAtBottom(entry.isIntersecting),
        { threshold: 0.5 }
      );
      observer.observe(sentinel);

      return () => {
        observer.disconnect();
        onAtBottom(false); // cancel auto-advance when chapter changes
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter =
      currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
    const nextAccessible = nextChapter
      ? isChapterAccessible(nextChapter)
      : false;
    const canAffordNext =
      nextChapter && !nextAccessible ? coins >= nextChapter.cost : true;

    return (
      <div
        ref={ref}
        className={`flex-1 overflow-y-auto transition-colors ${
          dark ? "bg-dark-bg" : "bg-white"
        }`}
      >
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Chapter header */}
          <p
            className={`text-xs font-semibold uppercase tracking-widest mb-2 text-primary`}
          >
            Chapter {chapter.id}
          </p>
          <h1
            className={`text-2xl font-bold mb-8 ${
              dark ? "text-white" : "text-text-primary"
            }`}
          >
            {chapter.title}
          </h1>

          {/* Chapter text */}
          <div
            className="space-y-5 leading-[1.9]"
            style={{ fontSize: `${fontSize}px` }}
          >
            {lines.map((line, lineIndex) => {
              const commentCount = lineCommentCounts[lineIndex] ?? 0;
              const selected = selectedLineIndex === lineIndex;

              return (
                <button
                  key={`${chapter.id}-${lineIndex}`}
                  type="button"
                  data-testid={`reader-line-${lineIndex}`}
                  aria-pressed={selected}
                  onClick={() => commentsVisible && onSelectLine(lineIndex, line)}
                  className={`group relative -mx-3 block w-[calc(100%+1.5rem)] rounded-lg px-3 py-2 text-left transition-colors ${
                    selected
                      ? dark
                        ? "bg-primary/15 text-white"
                        : "bg-primary-light text-text-primary"
                      : dark
                      ? "text-white/80 hover:bg-white/6 hover:text-white"
                      : "text-text-primary/80 hover:bg-accent hover:text-text-primary"
                  }`}
                >
                  <span>{line}</span>
                  {commentsVisible && commentCount > 0 && (
                    <span
                      data-testid={`reader-line-${lineIndex}-comment-count`}
                      className={`ml-2 inline-flex align-middle items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        dark
                          ? "bg-primary/20 text-primary"
                          : "bg-primary-light text-primary"
                      }`}
                    >
                      <MessageCircle size={12} />
                      {commentCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── Next chapter teaser / unlock ─── */}
          {nextChapter && (
            <div className="mt-16">
              {nextAccessible ? (
                /* Free or already-unlocked next chapter */
                <div
                  className={`rounded-2xl border p-6 text-center ${
                    dark
                      ? "border-white/10 bg-dark-surface"
                      : "border-border bg-accent"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                      dark ? "text-white/40" : "text-text-muted"
                    }`}
                  >
                    ตอนถัดไป
                  </p>
                  <p
                    className={`text-base font-bold mb-4 ${
                      dark ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {nextChapter.title}
                  </p>
                  {nextChapter.isFree && (
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${
                        dark
                          ? "bg-green-900/40 text-green-400"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      ฟรี
                    </span>
                  )}
                  <br />
                  <button
                    onClick={() => onNavigate(currentIndex + 1)}
                    className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-primary-hover transition-colors mt-2"
                  >
                    อ่านต่อ <ChevronRight size={15} />
                  </button>
                </div>
              ) : (
                /* Locked next chapter */
                <div className="relative rounded-2xl overflow-hidden">
                  {/* Blurred preview */}
                  <div
                    className={`p-8 blur-sm select-none pointer-events-none ${
                      dark ? "bg-dark-surface" : "bg-accent"
                    }`}
                  >
                    <p
                      className={`text-sm leading-relaxed ${
                        dark ? "text-white/60" : "text-text-muted"
                      }`}
                    >
                      {nextChapter.preview}
                    </p>
                  </div>

                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock size={20} className="text-primary" />
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        dark ? "text-white" : "text-text-primary"
                      }`}
                    >
                      Chapter {nextChapter.id}: {nextChapter.title}
                    </p>

                    {canAffordNext ? (
                      <button
                        onClick={() => onNavigate(currentIndex + 1)}
                        className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-hover transition-colors"
                      >
                        <Coins size={14} />
                        ปลดล็อก <ChapterCostLabel chapter={nextChapter} />
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => onNavigate(currentIndex + 1)}
                          className={`flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors ${
                            dark
                              ? "bg-white/10 text-white/50 cursor-not-allowed"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled
                        >
                          <Lock size={14} />
                          ต้องการ <ChapterCostLabel chapter={nextChapter} />
                        </button>
                        <p
                          className={`text-xs ${
                            dark ? "text-white/40" : "text-text-muted"
                          }`}
                        >
                          มีอยู่ {coins} เหรียญ — เติมเหรียญที่แถบด้านบน
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Episode navigation ─── */}
          <div
            className={`mt-12 pt-8 border-t ${
              dark ? "border-white/10" : "border-border"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-widest text-center mb-6 ${
                dark ? "text-white/40" : "text-text-muted"
              }`}
            >
              นำทางตอน
            </p>
            <div className="flex items-stretch gap-4">
              {/* Prev */}
              <button
                onClick={() => prevChapter && onNavigate(currentIndex - 1)}
                disabled={!prevChapter}
                className={`flex-1 flex items-center gap-3 p-4 rounded-xl border transition-colors group text-left ${
                  !prevChapter
                    ? dark
                      ? "border-white/5 opacity-30 cursor-not-allowed"
                      : "border-border opacity-30 cursor-not-allowed"
                    : dark
                    ? "border-white/10 hover:border-white/25 hover:bg-dark-surface cursor-pointer"
                    : "border-border hover:border-primary/30 hover:bg-accent cursor-pointer"
                }`}
              >
                <ChevronLeft
                  size={18}
                  className={`shrink-0 ${
                    dark
                      ? "text-white/40 group-hover:text-white"
                      : "text-text-muted group-hover:text-primary"
                  } transition-colors`}
                />
                <div className="min-w-0">
                  <p
                    className={`text-[11px] mb-0.5 ${
                      dark ? "text-white/40" : "text-text-muted"
                    }`}
                  >
                    ตอนที่แล้ว
                  </p>
                  <p
                    className={`text-sm font-semibold truncate ${
                      dark
                        ? "text-white/70 group-hover:text-white"
                        : "text-text-primary group-hover:text-primary"
                    } transition-colors`}
                  >
                    {prevChapter ? prevChapter.title : "— ยังไม่มีตอนก่อนหน้า"}
                  </p>
                </div>
              </button>

              {/* Current indicator */}
              <div
                className={`flex flex-col items-center justify-center px-4 rounded-xl ${
                  dark ? "bg-dark-surface" : "bg-accent"
                }`}
              >
                <BookOpen
                  size={16}
                  className={dark ? "text-white/40" : "text-text-muted"}
                />
                <p
                  className={`text-[11px] mt-1 font-medium ${
                    dark ? "text-white/40" : "text-text-muted"
                  }`}
                >
                  Ch. {chapter.id}
                </p>
              </div>

              {/* Next */}
              <button
                onClick={() => nextChapter && onNavigate(currentIndex + 1)}
                disabled={!nextChapter}
                className={`flex-1 flex items-center gap-3 p-4 rounded-xl border transition-colors group text-right ${
                  !nextChapter
                    ? dark
                      ? "border-white/5 opacity-30 cursor-not-allowed"
                      : "border-border opacity-30 cursor-not-allowed"
                    : dark
                    ? "border-white/10 hover:border-white/25 hover:bg-dark-surface cursor-pointer"
                    : "border-border hover:border-primary/30 hover:bg-accent cursor-pointer"
                }`}
              >
                <div className="flex-1 min-w-0 text-right">
                  <p
                    className={`text-[11px] mb-0.5 ${
                      dark ? "text-white/40" : "text-text-muted"
                    }`}
                  >
                    ตอนต่อไป
                  </p>
                  <div className="flex items-center justify-end gap-1.5">
                    {nextChapter && !nextAccessible && (
                      <span className="text-[10px] font-semibold text-primary">
                        <ChapterCostLabel chapter={nextChapter} />
                      </span>
                    )}
                    {nextChapter && !nextChapter.isFree && nextAccessible && (
                      <span
                        className={`text-[10px] font-semibold ${
                          dark ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        ปลดล็อกแล้ว
                      </span>
                    )}
                    <p
                      className={`text-sm font-semibold truncate ${
                        dark
                          ? "text-white/70 group-hover:text-white"
                          : "text-text-primary group-hover:text-primary"
                      } transition-colors`}
                    >
                      {nextChapter ? nextChapter.title : "— จบแล้ว"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className={`shrink-0 ${
                    dark
                      ? "text-white/40 group-hover:text-white"
                      : "text-text-muted group-hover:text-primary"
                  } transition-colors`}
                />
              </button>
            </div>

            {/* Back to detail */}
            <div className="mt-4 text-center">
              <Link
                href="/detail"
                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                  dark
                    ? "text-white/40 hover:text-white/70"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                ดูรายการตอนทั้งหมด
              </Link>
            </div>
          </div>
          {/* Sentinel — triggers auto-advance when scrolled into view */}
          <div ref={sentinelRef} className="h-1" aria-hidden />
        </div>
      </div>
    );
  }
);

export default ReaderContent;

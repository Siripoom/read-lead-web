"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Coins,
  Plus as PlusIcon,
  ChevronsRight,
  MessageCircle,
} from "lucide-react";
import type { Chapter } from "@/app/reader/page";

interface ReaderToolbarProps {
  theme: "dark" | "light";
  fontSize: number;
  onThemeChange: (theme: "dark" | "light") => void;
  onFontSizeChange: (size: number) => void;
  currentChapter: Chapter;
  currentIndex: number;
  chaptersCount: number;
  coins: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onAddCoins: () => void;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  commentsVisible: boolean;
  onToggleComments: () => void;
}

export default function ReaderToolbar({
  theme,
  fontSize,
  onThemeChange,
  onFontSizeChange,
  currentChapter,
  currentIndex,
  chaptersCount,
  coins,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onAddCoins,
  autoAdvance,
  onToggleAutoAdvance,
  commentsVisible,
  onToggleComments,
}: ReaderToolbarProps) {
  const dark = theme === "dark";

  return (
    <header
      className={`h-14 flex items-center justify-between px-4 border-b shrink-0 ${
        dark
          ? "bg-dark-surface border-dark-surface/50"
          : "bg-white border-border"
      } transition-colors`}
    >
      {/* Left: back + title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Link
          href="/detail"
          className={`p-2 rounded-full transition-colors shrink-0 ${
            dark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-accent text-text-primary"
          }`}
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <p
            className={`text-xs truncate ${
              dark ? "text-white/40" : "text-text-muted"
            }`}
          >
            The Obsidian Chronicles
          </p>
          <p
            className={`text-sm font-semibold truncate leading-tight ${
              dark ? "text-white" : "text-text-primary"
            }`}
          >
            Ch. {currentChapter.id} · {currentChapter.title}
          </p>
        </div>
      </div>

      {/* Center: font size + theme */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onFontSizeChange(Math.max(14, fontSize - 2))}
          className={`p-2 rounded-full transition-colors ${
            dark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-accent text-text-primary"
          }`}
        >
          <Minus size={14} />
        </button>
        <span
          className={`text-xs w-8 text-center font-medium ${
            dark ? "text-white/70" : "text-text-muted"
          }`}
        >
          {fontSize}px
        </span>
        <button
          onClick={() => onFontSizeChange(Math.min(26, fontSize + 2))}
          className={`p-2 rounded-full transition-colors ${
            dark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-accent text-text-primary"
          }`}
        >
          <Plus size={14} />
        </button>

        <div
          className={`w-px h-5 mx-1 ${dark ? "bg-white/15" : "bg-border"}`}
        />

        <button
          onClick={() => onThemeChange(dark ? "light" : "dark")}
          data-testid="reader-theme-toggle"
          aria-label={dark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
          title={dark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
          className={`p-2 rounded-full transition-colors ${
            dark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-accent text-text-primary"
          }`}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className={`w-px h-5 mx-1 ${dark ? "bg-white/15" : "bg-border"}`} />

        {/* Auto-advance toggle */}
        <button
          onClick={onToggleAutoAdvance}
          title={autoAdvance ? "ปิดข้ามตอนอัตโนมัติ" : "เปิดข้ามตอนอัตโนมัติ"}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors ${
            autoAdvance
              ? dark
                ? "bg-primary/20 text-primary"
                : "bg-primary/10 text-primary"
              : dark
              ? "bg-white/8 text-white/35 hover:text-white/60"
              : "bg-accent text-text-muted hover:text-text-primary"
          }`}
        >
          <ChevronsRight size={14} />
          <span className="hidden sm:inline">Auto</span>
        </button>

        <button
          onClick={onToggleComments}
          data-testid="reader-comments-toggle"
          aria-pressed={commentsVisible}
          title={commentsVisible ? "ซ่อนคอมเมนต์" : "แสดงคอมเมนต์"}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors ${
            commentsVisible
              ? dark
                ? "bg-primary/20 text-primary"
                : "bg-primary/10 text-primary"
              : dark
              ? "bg-white/8 text-white/35 hover:text-white/60"
              : "bg-accent text-text-muted hover:text-text-primary"
          }`}
        >
          <MessageCircle size={14} />
          <span className="hidden sm:inline">Comments</span>
        </button>
      </div>

      {/* Right: coins + prev/next */}
      <div className="flex items-center gap-2 shrink-0 flex-1 justify-end">
        {/* Coin balance with add button */}
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 ${
            dark ? "bg-white/8" : "bg-amber-50 border border-amber-200"
          }`}
        >
          <Coins
            size={13}
            className={dark ? "text-amber-400" : "text-amber-500"}
          />
          <span
            className={`text-xs font-semibold ${
              dark ? "text-amber-400" : "text-amber-600"
            }`}
          >
            {coins}
          </span>
          <button
            onClick={onAddCoins}
            title="เติม 10 เหรียญ (สำหรับทดสอบ)"
            className={`ml-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              dark
                ? "bg-amber-400/20 hover:bg-amber-400/40 text-amber-400"
                : "bg-amber-200 hover:bg-amber-300 text-amber-700"
            }`}
          >
            <PlusIcon size={10} />
          </button>
        </div>

        <div
          className={`w-px h-5 ${dark ? "bg-white/15" : "bg-border"}`}
        />

        {/* Prev chapter */}
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            !canGoPrev
              ? dark
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-accent text-text-muted/40 cursor-not-allowed"
              : dark
              ? "bg-white/10 text-white/70 hover:text-white hover:bg-white/15"
              : "bg-accent text-text-muted hover:text-text-primary"
          }`}
        >
          <ChevronLeft size={14} /> Prev
        </button>

        {/* Chapter counter */}
        <span
          className={`text-xs font-medium tabular-nums ${
            dark ? "text-white/30" : "text-text-muted"
          }`}
        >
          {currentIndex + 1}/{chaptersCount}
        </span>

        {/* Next chapter */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            !canGoNext
              ? "bg-primary/30 text-white/40 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </header>
  );
}

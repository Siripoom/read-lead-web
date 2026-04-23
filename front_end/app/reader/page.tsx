"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import ReaderToolbar from "@/components/reader/ReaderToolbar";
import ReaderContent from "@/components/reader/ReaderContent";
import ReaderLineCommentPanel from "@/components/reader/ReaderLineCommentPanel";
import AdPlacementBanner from "@/components/ads/AdPlacementBanner";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import {
  resolveEpisodePrice,
  type CreatorPromotion,
  type CreatorPromotionScope,
} from "@/lib/creator-studio";
import {
  getCoins,
  saveCoins,
  addCoins,
  getUnlockedChapters,
  unlockChapter,
} from "@/lib/coins";

const READER_WORK_ID = "work-obsidian-chronicles";

export interface Chapter {
  id: number;
  title: string;
  isFree: boolean;
  cost: number;
  originalCost?: number;
  activePromotion?: CreatorPromotion & { scope: CreatorPromotionScope };
  preview: string; // shown as teaser when locked
  content: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "The Beginning of the End",
    isFree: true,
    cost: 0,
    preview: "",
    content: `The archive smelled of forgotten centuries.

Sera pressed her palm against the cold obsidian door, feeling the pulse of old magic beneath her fingertips. She had been an archivist for seven years—long enough to know that some doors were never meant to be opened.

And yet.

The tome had called to her in dreams, its pages rustling in the dark corners of her sleep, whispering names of people who had never existed, dates that hadn't happened yet. She had dismissed it as stress, as overwork, as the natural consequence of spending too many hours cataloguing the dead thoughts of dead scholars.

But then she had found the door.

"You're not supposed to be here," said a voice behind her.

Sera didn't turn around. She recognized the voice—Maren, her supervisor, the woman who had taught her everything about the archive's invisible laws. The woman who had, three weeks ago, told her that the lower vaults were sealed by order of the High Council.

"I know," Sera said.

"Then you know what happens next."

The door pulsed again. Warm this time. Almost welcoming.

"I know what the records say," Sera replied. "But I've been reading between the lines, Maren. The Obsidian Vault wasn't sealed to protect the Council from what's inside." She finally turned. Maren's face was unreadable, carved from the same patience as the stone walls. "It was sealed to protect what's inside from them."

The silence that followed lasted exactly long enough for Sera to understand she was right.`,
  },
  {
    id: 2,
    title: "Shadows in the Archive",
    isFree: false,
    cost: 3,
    preview:
      "The vault door swung open with a sound like a held breath finally released. Inside, the darkness was absolute—not the darkness of absence, but the darkness of presence, of something vast and ancient waiting to be...",
    content: `The vault door swung open with a sound like a held breath finally released.

Inside, the darkness was absolute—not the darkness of absence, but the darkness of presence, of something vast and ancient waiting patiently. Sera stepped forward, her lantern catching on walls lined with obsidian panels etched with writing she had never seen in any catalogue.

She reached out to trace the symbols. They were warm.

"Don't touch them," Maren said quietly from the doorway. "Not yet."

The word 'yet' hung in the air between them like smoke.

Sera pulled her hand back, though the warmth seemed to follow—a faint tingling in her fingertips that climbed to her wrist and settled there like a second pulse. She looked at Maren, who was watching her with an expression she couldn't name. Something between hope and grief.

"You've been here before," Sera said.

"Many times."

"Who else knows about this place?"

Maren stepped inside at last, the door swinging shut behind her with a sound like a sigh. "That depends," she said, "on how you define knows."

The lantern flickered. For a moment, every symbol on the wall blazed violet—and Sera saw them clearly: names. Thousands of names, arranged not in lists but in spirals, each one connected to another by threads of light so fine they vanished when she blinked.

Her own name was there.

So was her mother's.

So, she realized with a cold that had nothing to do with the stone, was the name of the girl she had been before she came to the archive.

The name she had been told never to speak again.`,
  },
  {
    id: 3,
    title: "The Forbidden Key",
    isFree: false,
    cost: 3,
    preview:
      "Maren placed the object in Sera's hands—small, heavier than it looked, and impossibly cold. A key unlike any she had catalogued. Its bow was shaped like a closed eye...",
    content: `Maren placed the object in Sera's hands—small, heavier than it looked, and impossibly cold.

A key unlike any she had catalogued. Its bow was shaped like a closed eye, the lid sealed with what appeared to be real lashes wrought in silver. The blade was short and oddly curved, as though designed to fit something organic rather than mechanical.

"What does it open?" Sera asked.

"The question," Maren said, "is not what. It's when."

Sera turned it over. On the underside of the bow, barely visible, were two dates. The first was 400 years ago. The second was seven days from today.

She looked up.

"Seven days," she said.

"Yes."

"What happens in seven days?"

Maren took a long time to answer. Long enough that Sera had time to notice the symbols on the walls had changed—subtly, the way a room changes when someone has moved through it in the dark. Some names were gone. Others had appeared.

"In seven days," Maren said finally, "someone will come to take what's in this vault. We don't know who. We don't know exactly how. We only know that the vault's protections will fail unless the key is used before then."

Sera looked at the closed-eye bow.

"Used how?"

"That's what you're here to figure out."

The eye on the key opened.

Sera nearly dropped it.

The iris was violet—the same color as the symbols when they had blazed. And it was looking, unmistakably, directly at her.

"Hello," it said, in a voice like old paper.`,
  },
  {
    id: 4,
    title: "The Voice in the Lock",
    isFree: true,
    cost: 0,
    preview: "",
    content: `The key had a name. Of course it did.

"Orin," it said. "Though I have been called other things. Instrument. Abomination. The Warden's Mistake." A pause. "I prefer Orin."

Sera, who had spent seven years cataloguing impossible things without touching them, gripped the key more tightly. "You're sentient."

"Intermittently. Consciousness is expensive. I save it for necessary moments."

"Is this a necessary moment?"

"You are the first person in ninety-three years to enter this vault without dying," Orin said. "I thought that warranted conversation."

Maren, Sera noticed, had gone very still. She was watching the key the way one watched a flame: with respect and the specific wariness of someone who has been burned before.

"Ninety-three years," Sera said. "You've been waiting that long?"

"Waiting implies hope. I was simply... persisting." The eye blinked—slowly, with the deliberateness of something conserving energy. "But now you are here, and the countdown has begun, and I find myself hoping after all. It's an unpleasant sensation. I recommend against it, if you have the option."

Sera almost laughed. "Why can't I die in here?"

"Because you are already half-dead," Orin said simply. "And the vault's protections don't know what to do with you."

The room went very quiet.

Sera looked at Maren.

Maren looked at the floor.

"Someone," Sera said carefully, "had better start explaining."`,
  },
  {
    id: 5,
    title: "The Half-Dead Girl",
    isFree: false,
    cost: 5,
    preview:
      "Maren sat on the cold vault floor as though her legs had simply decided they were done. Sera had never seen her sit anywhere that wasn't a chair. It made her look, suddenly, very old...",
    content: `Maren sat on the cold vault floor as though her legs had simply decided they were done.

Sera had never seen her sit anywhere that wasn't a chair. It made her look, suddenly, very old—and very tired in the way that had nothing to do with sleep.

"Your mother," Maren said, "was the previous Archivist."

Sera waited.

"Not the one in the records. The real one. The one the Council removed from history twenty-four years ago, when she discovered what they had done to the vault."

"What did they do?"

"They split it." Maren pressed her palms flat against the stone, as though drawing steadiness from it. "The vault was designed to hold a single object—the Codex of the First Words, a text that predates every known civilization and contains, as best anyone has determined, the instructions for ending the world. Not destroying it. Ending it. Peacefully. Completely. With no remainder."

Sera sat down across from her.

"The Council decided that was too much power in one place," Maren continued. "So they divided the vault into two halves. The physical half—this room—and a second half that exists..." She gestured vaguely upward. "Elsewhere. In the space between moments, in the margin the universe leaves between what happened and what could have happened."

"And my mother?"

"Tried to reconnect the halves. The process requires a bridge." Maren finally looked at her. "A person who exists in both spaces simultaneously. Someone who is, as Orin puts it, half-dead."

The key in Sera's hands was warm now.

"She didn't survive the attempt," Maren said. "But the connection she started—it held. Partially. In you."

Sera understood, then, why she had always felt like she was standing in two places at once. Why mirrors sometimes showed her a room she wasn't in. Why, sometimes, she could read the thoughts of the books before she opened them.

"The vault called to me," she said, "because I'm already attached to it."

"Yes."

Orin's eye had closed again. Conserving consciousness.

Outside, somewhere in the archive above, a clock began to strike the hour—and on the wall behind Maren, seven names went dark simultaneously.

Seven days. Six days, twenty-three hours, and some number of minutes, now.

Sera looked at the key.

"Alright," she said. "Tell me what I need to do."`,
  },
];

export type UnlockToast = {
  cost: number;
  remaining: number;
  chapterTitle: string;
} | null;

export interface LineComment {
  id: string;
  chapterId: number;
  lineIndex: number;
  lineText: string;
  user: string;
  avatarLabel: string;
  text: string;
  createdAt: string;
}

export interface SelectedLine {
  chapterId: number;
  lineIndex: number;
  lineText: string;
}

const LINE_COMMENTS_STORAGE_KEY = "readlead_reader_line_comments";

function getChapterLines(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function createLineCommentId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `line-comment-${crypto.randomUUID()}`;
  }

  return `line-comment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadLineComments() {
  try {
    const raw = window.localStorage.getItem(LINE_COMMENTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((comment): comment is LineComment => {
      return (
        typeof comment?.id === "string" &&
        typeof comment.chapterId === "number" &&
        typeof comment.lineIndex === "number" &&
        typeof comment.lineText === "string" &&
        typeof comment.user === "string" &&
        typeof comment.avatarLabel === "string" &&
        typeof comment.text === "string" &&
        typeof comment.createdAt === "string"
      );
    });
  } catch {
    window.localStorage.removeItem(LINE_COMMENTS_STORAGE_KEY);
    return [];
  }
}

export default function ReaderPage() {
  const { getWorkById, getEpisodesByWorkId } = useCreatorStudio();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState(17);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coins, setCoins] = useState(0);
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<UnlockToast>(null);
  const [insufficientCoins, setInsufficientCoins] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [countdown, setCountdown] = useState(1);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [commentsVisible, setCommentsVisible] = useState(true);
  const [lineComments, setLineComments] = useState<LineComment[]>([]);
  const [commentsHydrated, setCommentsHydrated] = useState(false);
  const [selectedLine, setSelectedLine] = useState<SelectedLine | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);
  const work = getWorkById(READER_WORK_ID);
  const chapters = useMemo(
    () => {
      const creatorEpisodes = work ? getEpisodesByWorkId(work.id) : [];

      return CHAPTERS.map((chapter) => {
        const creatorEpisode = creatorEpisodes.find(
          (episode) => episode.number === chapter.id,
        );
        const fallbackPrice = chapter.isFree ? "free" : chapter.cost;
        const resolvedPrice = resolveEpisodePrice(
          creatorEpisode ?? { price: fallbackPrice },
          work,
        );
        const finalCost =
          resolvedPrice.finalPrice === "free" ? 0 : resolvedPrice.finalPrice;

        return {
          ...chapter,
          title: creatorEpisode?.title ?? chapter.title,
          isFree: resolvedPrice.finalPrice === "free",
          cost: finalCost,
          originalCost:
            resolvedPrice.originalPrice === "free"
              ? undefined
              : resolvedPrice.originalPrice,
          activePromotion: resolvedPrice.activePromotion,
        };
      });
    },
    [getEpisodesByWorkId, work],
  );

  // Load from localStorage on mount
  useEffect(() => {
    setCoins(getCoins());
    setUnlocked(new Set(getUnlockedChapters()));
    setLineComments(loadLineComments());
    setCommentsHydrated(true);
  }, []);

  useEffect(() => {
    if (!commentsHydrated) return;

    window.localStorage.setItem(
      LINE_COMMENTS_STORAGE_KEY,
      JSON.stringify(lineComments)
    );
  }, [commentsHydrated, lineComments]);

  const isChapterAccessible = (chapter: Chapter) =>
    chapter.isFree || unlocked.has(chapter.id);

  const showToast = (data: UnlockToast) => {
    setToast(data);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3000);
  };

  const navigateTo = (targetIndex: number) => {
    const target = chapters[targetIndex];
    if (!target) return;

    if (isChapterAccessible(target)) {
      setCurrentIndex(targetIndex);
      setSelectedLine(null);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Paid chapter: auto-deduct if coins are sufficient
    if (coins >= target.cost) {
      const newCoins = coins - target.cost;
      setCoins(newCoins);
      saveCoins(newCoins);
      unlockChapter(target.id);
      setUnlocked((prev) => new Set([...prev, target.id]));
      setCurrentIndex(targetIndex);
      setSelectedLine(null);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      showToast({
        cost: target.cost,
        remaining: newCoins,
        chapterTitle: target.title,
      });
    } else {
      setInsufficientCoins(true);
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(
        () => setInsufficientCoins(false),
        3000
      );
    }
  };

  const currentChapter = chapters[currentIndex];
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const nextAccessible = nextChapter ? isChapterAccessible(nextChapter) : false;
  const chapterLines = useMemo(
    () => getChapterLines(currentChapter.content),
    [currentChapter.content]
  );
  const currentChapterComments = useMemo(
    () =>
      lineComments.filter(
        (comment) => comment.chapterId === currentChapter.id
      ),
    [currentChapter.id, lineComments]
  );
  const lineCommentCounts = useMemo(() => {
    return currentChapterComments.reduce<Record<number, number>>(
      (counts, comment) => {
        counts[comment.lineIndex] = (counts[comment.lineIndex] ?? 0) + 1;
        return counts;
      },
      {}
    );
  }, [currentChapterComments]);
  const selectedLineComments = selectedLine
    ? lineComments.filter(
        (comment) =>
          comment.chapterId === selectedLine.chapterId &&
          comment.lineIndex === selectedLine.lineIndex
      )
    : [];

  // Auto-advance countdown when reader reaches the bottom
  useEffect(() => {
    if (!atBottom || !nextChapter || !autoAdvance) return;

    setCountdown(1);
    const t1 = window.setTimeout(() => {
      navigateTo(currentIndex + 1);
      setAtBottom(false);
    }, 1000);

    return () => {
      window.clearTimeout(t1);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atBottom, nextChapter?.id, autoAdvance]);

  const cancelAutoAdvance = () => setAtBottom(false);

  const handleToggleAutoAdvance = () => {
    setAutoAdvance((v) => {
      if (v) setAtBottom(false); // cancel any running countdown when turning off
      return !v;
    });
  };

  const handleToggleComments = () => {
    setCommentsVisible((visible) => {
      if (visible) {
        setSelectedLine(null);
      }
      return !visible;
    });
  };

  const handleAddCoins = () => {
    const newCoins = addCoins(10);
    setCoins(newCoins);
    showToast({ cost: -10, remaining: newCoins, chapterTitle: "" });
  };

  const handleSelectLine = (lineIndex: number, lineText: string) => {
    if (!commentsVisible) return;

    setSelectedLine({
      chapterId: currentChapter.id,
      lineIndex,
      lineText,
    });
    setAtBottom(false);
  };

  const handleSubmitLineComment = (text: string) => {
    const trimmedText = text.trim();
    if (!selectedLine || !trimmedText) return;

    const newComment: LineComment = {
      id: createLineCommentId(),
      chapterId: selectedLine.chapterId,
      lineIndex: selectedLine.lineIndex,
      lineText: selectedLine.lineText,
      user: "You",
      avatarLabel: "Y",
      text: trimmedText,
      createdAt: new Date().toISOString(),
    };

    setLineComments((prev) => [...prev, newComment]);
  };

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden transition-colors ${
        theme === "dark" ? "bg-dark-bg" : "bg-white"
      }`}
    >
      <ReaderToolbar
        theme={theme}
        fontSize={fontSize}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
        currentChapter={currentChapter}
        currentIndex={currentIndex}
        chaptersCount={chapters.length}
        coins={coins}
        canGoPrev={prevChapter !== null}
        canGoNext={nextChapter !== null}
        onPrev={() => navigateTo(currentIndex - 1)}
        onNext={() => navigateTo(currentIndex + 1)}
        onAddCoins={handleAddCoins}
        autoAdvance={autoAdvance}
        onToggleAutoAdvance={handleToggleAutoAdvance}
        commentsVisible={commentsVisible}
        onToggleComments={handleToggleComments}
      />

      {/* Coin toast */}
      {(toast || insufficientCoins) && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          {toast && toast.cost === -10 ? (
            <div className="bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg animate-fade-in">
              เติม 10 เหรียญ · คงเหลือ {toast.remaining} เหรียญ
            </div>
          ) : toast && toast.cost > 0 ? (
            <div className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
              ใช้ {toast.cost} เหรียญ · คงเหลือ {toast.remaining} เหรียญ
            </div>
          ) : insufficientCoins ? (
            <div className="bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
              เหรียญไม่พอ · กดเติมเหรียญที่แถบด้านบน
            </div>
          ) : null}
        </div>
      )}

      <ReaderContent
        ref={contentRef}
        theme={theme}
        fontSize={fontSize}
        chapter={currentChapter}
        chapters={chapters}
        currentIndex={currentIndex}
        coins={coins}
        lines={chapterLines}
        selectedLineIndex={
          selectedLine?.chapterId === currentChapter.id
            ? selectedLine.lineIndex
            : null
        }
        lineCommentCounts={lineCommentCounts}
        commentsVisible={commentsVisible}
        isChapterAccessible={isChapterAccessible}
        onNavigate={navigateTo}
        onAtBottom={setAtBottom}
        onSelectLine={handleSelectLine}
      />

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 mx-auto hidden max-w-2xl px-6 lg:block">
        <div className="pointer-events-auto">
          <AdPlacementBanner placement="reader" theme={theme} />
        </div>
      </div>

      {commentsVisible && selectedLine && selectedLine.chapterId === currentChapter.id && (
        <ReaderLineCommentPanel
          key={`${selectedLine.chapterId}-${selectedLine.lineIndex}`}
          theme={theme}
          line={selectedLine}
          comments={selectedLineComments}
          onClose={() => setSelectedLine(null)}
          onSubmit={handleSubmitLineComment}
        />
      )}

      {/* Auto-advance bottom bar */}
      {atBottom && nextChapter && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 border-t shadow-xl transition-colors ${
            theme === "dark"
              ? "bg-dark-surface border-white/10"
              : "bg-white border-border"
          }`}
        >
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-4">
            {/* Countdown ring */}
            <div className="relative w-10 h-10 shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={theme === "dark" ? "text-white/10" : "text-gray-200"}
                />
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={`${countdown * 94.2} 94.2`}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <span
                className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                  theme === "dark" ? "text-white" : "text-text-primary"
                }`}
              >
                {countdown}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs mb-0.5 ${theme === "dark" ? "text-white/40" : "text-text-muted"}`}>
                กำลังข้ามไปตอนถัดไปอัตโนมัติ
              </p>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold truncate ${theme === "dark" ? "text-white" : "text-text-primary"}`}>
                  Ch.{nextChapter.id} {nextChapter.title}
                </p>
                {!nextAccessible && (
                  <span className="shrink-0 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {nextChapter.activePromotion && nextChapter.originalCost
                      ? `${nextChapter.originalCost}→${nextChapter.cost} เหรียญ ลด ${nextChapter.activePromotion.discountPercent}%`
                      : `${nextChapter.cost} เหรียญ`}
                  </span>
                )}
                {nextAccessible && !nextChapter.isFree && (
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${theme === "dark" ? "text-green-400 bg-green-900/30" : "text-green-700 bg-green-100"}`}>
                    ปลดล็อกแล้ว
                  </span>
                )}
                {nextChapter.isFree && (
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${theme === "dark" ? "text-green-400 bg-green-900/30" : "text-green-700 bg-green-100"}`}>
                    ฟรี
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={cancelAutoAdvance}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  theme === "dark"
                    ? "border-white/15 text-white/60 hover:text-white hover:border-white/30"
                    : "border-border text-text-muted hover:text-text-primary hover:border-gray-400"
                }`}
              >
                ยกเลิก
              </button>
              <button
                onClick={() => { cancelAutoAdvance(); navigateTo(currentIndex + 1); }}
                className="text-xs px-4 py-1.5 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors font-semibold"
              >
                ข้ามเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

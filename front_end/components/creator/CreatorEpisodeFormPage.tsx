"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowUp,
  ArrowDown,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo,
  Trash2,
  Undo,
  Upload,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import {
  CREATOR_WORK_TYPE_LABELS,
  createEmptyEpisodeData,
  normalizePromotion,
  type AudiobookEpisodeData,
  type CreatorPromotion,
  type CreatorWorkType,
  type MangaEpisodeData,
  type NovelEpisodeData,
} from "@/lib/creator-studio";
import {
  loadEpisodePricePolicy,
  type EpisodePricePolicy,
} from "@/lib/monetization";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
      {children}
    </label>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("FileReader returned an unsupported result"));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Could not read file"));
    };

    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("FileReader returned an unsupported result"));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Could not read file"));
    };

    reader.readAsText(file);
  });
}

function renderDocxFile(file: File) {
  return new Promise<{
    layoutHtml: string;
    layoutCss: string;
    text: string;
  }>(async (resolve, reject) => {
    try {
      const { renderAsync } = await import("docx-preview");
      const bodyContainer = document.createElement("div");
      const styleContainer = document.createElement("div");

      bodyContainer.className = "docx-preview-body";
      await renderAsync(file, bodyContainer, styleContainer, {
        className: "docx",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: false,
      });

      resolve({
        layoutHtml: bodyContainer.innerHTML,
        layoutCss: styleContainer.innerHTML,
        text: bodyContainer.textContent ?? "",
      });
    } catch (error) {
      reject(
        error instanceof Error ? error : new Error("Could not render DOCX"),
      );
    }
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function txtToHtml(text: string) {
  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
  if (!normalizedText) return "";

  return normalizedText
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`,
    )
    .join("");
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getFilledPages(pages: string[]) {
  return pages.filter((page) => page.trim().length > 0);
}

function createDraftId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `episode-import-${crypto.randomUUID()}`;
  }

  return `episode-import-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getImportedEpisodeTitle(fileName: string) {
  return fileName.replace(/\.(txt|docx)$/i, "").trim() || "ตอนใหม่";
}

interface ImportedNovelEpisodeDraft {
  id: string;
  fileName: string;
  title: string;
  number: number;
  releaseDate: string;
  content: string;
  wordCount: number;
  sourceFormat: "txt" | "docx";
  layoutHtml?: string;
  layoutCss?: string;
}

function renumberImportedEpisodes(
  drafts: ImportedNovelEpisodeDraft[],
  startNumber: number,
) {
  const safeStartNumber = Math.max(1, startNumber || 1);
  return drafts.map((draft, index) => ({
    ...draft,
    number: safeStartNumber + index,
  }));
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg p-2 transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-text-muted hover:bg-accent hover:text-text-primary"
      } disabled:cursor-default disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function DocxLayoutPreview({
  html,
  css,
  fileName,
}: {
  html: string;
  css: string;
  fileName?: string;
}) {
  return (
    <Card className="overflow-hidden border border-border">
      <div className="border-b border-border bg-accent/50 px-4 py-3">
        <p className="text-sm font-semibold text-text-primary">
          ตัวอย่าง DOCX แบบรักษาหน้ากระดาษ{fileName ? ` • ${fileName}` : ""}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ตอนที่นำเข้าจาก DOCX จะแสดงเป็น preview เพื่อคง layout จากไฟล์ต้นฉบับ
        </p>
      </div>
      <div className="max-h-[720px] overflow-auto bg-neutral-100 p-4">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div
          className="docx-layout-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Card>
  );
}

interface CreatorEpisodeFormPageProps {
  mode: "create" | "edit";
  workId: string;
  episodeId?: string;
}

export default function CreatorEpisodeFormPage({
  mode,
  workId,
  episodeId,
}: CreatorEpisodeFormPageProps) {
  const router = useRouter();
  const { getWorkById, getEpisodesByWorkId, createEpisode, updateEpisode } =
    useCreatorStudio();
  const work = getWorkById(workId);
  const existingEpisode = useMemo(
    () =>
      episodeId
        ? getEpisodesByWorkId(workId).find(
            (episode) => episode.id === episodeId,
          )
        : undefined,
    [episodeId, getEpisodesByWorkId, workId],
  );
  const nextNumber = useMemo(() => {
    const episodes = getEpisodesByWorkId(workId);
    if (episodes.length === 0) return 1;
    return Math.max(...episodes.map((episode) => episode.number)) + 1;
  }, [getEpisodesByWorkId, workId]);

  const [title, setTitle] = useState(existingEpisode?.title ?? "");
  const [number, setNumber] = useState(existingEpisode?.number ?? nextNumber);
  const [status, setStatus] = useState(existingEpisode?.status ?? "draft");
  const [releaseDate, setReleaseDate] = useState(
    existingEpisode?.releaseDate ?? new Date().toISOString().slice(0, 10),
  );
  const [priceMode, setPriceMode] = useState(
    existingEpisode
      ? existingEpisode.price === "free"
        ? "free"
        : "paid"
      : "free",
  );
  const [episodePricePolicy, setEpisodePricePolicy] =
    useState<EpisodePricePolicy>({
      minCoins: 1,
      maxCoins: 30,
      recommendedCoins: 3,
    });
  const [coinPrice, setCoinPrice] = useState(
    existingEpisode?.price === "free" ? 3 : Number(existingEpisode?.price ?? 3),
  );
  const [promotionEnabled, setPromotionEnabled] = useState(
    Boolean(existingEpisode?.promotion) && existingEpisode?.price !== "free",
  );
  const [promotionDiscount, setPromotionDiscount] = useState(
    existingEpisode?.promotion?.discountPercent ?? 20,
  );
  const [promotionStartDate, setPromotionStartDate] = useState(
    existingEpisode?.promotion?.startDate ?? new Date().toISOString().slice(0, 10),
  );
  const [promotionEndDate, setPromotionEndDate] = useState(
    existingEpisode?.promotion?.endDate ?? new Date().toISOString().slice(0, 10),
  );
  const [episodeType, setEpisodeType] = useState<CreatorWorkType>(
    existingEpisode?.type ?? work?.type ?? "novel",
  );
  const [mangaData, setMangaData] = useState<MangaEpisodeData>(
    (existingEpisode?.typeSpecificData as MangaEpisodeData) ??
      (createEmptyEpisodeData("manga") as MangaEpisodeData),
  );
  const [audioData, setAudioData] = useState<AudiobookEpisodeData>(
    (existingEpisode?.typeSpecificData as AudiobookEpisodeData) ??
      (createEmptyEpisodeData("audiobook") as AudiobookEpisodeData),
  );
  const [uploadError, setUploadError] = useState("");
  const [importedNovelDrafts, setImportedNovelDrafts] = useState<
    ImportedNovelEpisodeDraft[]
  >([]);
  const [selectedImportedDraftId, setSelectedImportedDraftId] = useState<
    string | null
  >(null);

  const initialNovelData =
    (existingEpisode?.typeSpecificData as NovelEpisodeData) ??
    (createEmptyEpisodeData("novel") as NovelEpisodeData);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialNovelData.content,
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] rounded-b-2xl border-x border-b border-border px-6 py-5 focus:outline-none prose prose-sm max-w-none text-text-primary",
      },
    },
  });
  const selectedImportedDraft = importedNovelDrafts.find(
    (draft) => draft.id === selectedImportedDraftId,
  );
  const selectedImportedDraftContent = selectedImportedDraft?.content ?? "";
  const isNovelBatchMode =
    mode === "create" &&
    episodeType === "novel" &&
    importedNovelDrafts.length > 0;
  const selectedImportedDraftIsDocx =
    selectedImportedDraft?.sourceFormat === "docx";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const policy = loadEpisodePricePolicy();
      setEpisodePricePolicy(policy);
      if (!existingEpisode || existingEpisode.price === "free") {
        setCoinPrice(policy.recommendedCoins);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [existingEpisode]);

  useEffect(() => {
    if (!editor || !selectedImportedDraftId || selectedImportedDraftIsDocx)
      return;

    editor.commands.setContent(selectedImportedDraftContent);
  }, [
    editor,
    selectedImportedDraftContent,
    selectedImportedDraftId,
    selectedImportedDraftIsDocx,
  ]);

  if (!work) {
    return (
      <div className="p-6">
        <Card className="border border-border p-6">
          <h1 className="text-xl font-bold text-text-primary">
            ไม่พบนิยายสำหรับตอนนี้
          </h1>
          <Button
            className="mt-4"
            onClick={() => router.push("/creator?tab=works")}
          >
            กลับไปรายการนิยาย
          </Button>
        </Card>
      </div>
    );
  }

  if (mode === "edit" && !existingEpisode) {
    return (
      <div className="p-6">
        <Card className="border border-border p-6">
          <h1 className="text-xl font-bold text-text-primary">
            ไม่พบตอนที่ต้องการแก้ไข
          </h1>
          <Button
            className="mt-4"
            onClick={() => router.push(`/creator/works/${work.id}`)}
          >
            กลับไปหน้ารายละเอียดนิยาย
          </Button>
        </Card>
      </div>
    );
  }

  const activeWork = work;

  function normalizedPrice() {
    if (priceMode === "free") return "free";
    return Math.min(
      episodePricePolicy.maxCoins,
      Math.max(episodePricePolicy.minCoins, Math.floor(coinPrice)),
    );
  }

  function getPromotionPayload(): CreatorPromotion | undefined {
    if (priceMode === "free" || !promotionEnabled) return undefined;
    return normalizePromotion({
      discountPercent: promotionDiscount,
      startDate: promotionStartDate,
      endDate: promotionEndDate,
    });
  }

  function getImportedDraftsWithCurrentEditor() {
    if (!editor || !selectedImportedDraftId) return importedNovelDrafts;

    const selectedDraft = importedNovelDrafts.find(
      (draft) => draft.id === selectedImportedDraftId,
    );
    if (selectedDraft?.sourceFormat === "docx") return importedNovelDrafts;

    const currentContent = editor.getHTML();
    const currentWordCount = countWords(editor.getText());

    return importedNovelDrafts.map((draft) =>
      draft.id === selectedImportedDraftId
        ? { ...draft, content: currentContent, wordCount: currentWordCount }
        : draft,
    );
  }

  function updateImportedDraft(
    draftId: string,
    patch: Partial<
      Pick<ImportedNovelEpisodeDraft, "title" | "number" | "releaseDate">
    >,
  ) {
    setImportedNovelDrafts((prev) =>
      prev.map((draft) =>
        draft.id === draftId ? { ...draft, ...patch } : draft,
      ),
    );
  }

  function selectImportedDraft(draftId: string) {
    setImportedNovelDrafts(getImportedDraftsWithCurrentEditor());
    setSelectedImportedDraftId(draftId);
  }

  function moveImportedDraft(draftId: string, direction: -1 | 1) {
    const drafts = getImportedDraftsWithCurrentEditor();
    const index = drafts.findIndex((draft) => draft.id === draftId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= drafts.length) return;

    const reorderedDrafts = [...drafts];
    [reorderedDrafts[index], reorderedDrafts[nextIndex]] = [
      reorderedDrafts[nextIndex],
      reorderedDrafts[index],
    ];
    setImportedNovelDrafts(renumberImportedEpisodes(reorderedDrafts, number));
  }

  function removeImportedDraft(draftId: string) {
    const drafts = getImportedDraftsWithCurrentEditor();
    const nextDrafts = renumberImportedEpisodes(
      drafts.filter((draft) => draft.id !== draftId),
      number,
    );

    setImportedNovelDrafts(nextDrafts);

    if (selectedImportedDraftId === draftId) {
      setSelectedImportedDraftId(nextDrafts[0]?.id ?? null);
      if (nextDrafts.length === 0) {
        editor?.commands.clearContent();
      }
    }
  }

  async function handleNovelUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const supportedFiles = files.filter(
      (file) =>
        file.name.toLowerCase().endsWith(".txt") ||
        file.name.toLowerCase().endsWith(".docx") ||
        file.type === "text/plain" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    if (supportedFiles.length === 0) {
      setUploadError("รองรับเฉพาะไฟล์ TXT หรือ DOCX สำหรับนิยายเนื้อหา");
      return;
    }

    try {
      const currentDrafts = getImportedDraftsWithCurrentEditor();
      const importedDrafts = await Promise.all(
        supportedFiles.map(async (file, index) => {
          const isDocx = file.name.toLowerCase().endsWith(".docx");

          if (isDocx) {
            const rendered = await renderDocxFile(file);
            return {
              id: createDraftId(),
              fileName: file.name,
              title: getImportedEpisodeTitle(file.name),
              number: number + currentDrafts.length + index,
              releaseDate,
              content: txtToHtml(rendered.text),
              wordCount: countWords(rendered.text),
              sourceFormat: "docx" as const,
              layoutHtml: rendered.layoutHtml,
              layoutCss: rendered.layoutCss,
            };
          }

          const text = await readFileAsText(file);
          return {
            id: createDraftId(),
            fileName: file.name,
            title: getImportedEpisodeTitle(file.name),
            number: number + currentDrafts.length + index,
            releaseDate,
            content: txtToHtml(text),
            wordCount: countWords(text),
            sourceFormat: "txt" as const,
          };
        }),
      );
      const nextDrafts = [...currentDrafts, ...importedDrafts];

      setImportedNovelDrafts(nextDrafts);
      setSelectedImportedDraftId(
        (prev) => prev ?? importedDrafts[0]?.id ?? null,
      );
      setUploadError(
        supportedFiles.length === files.length
          ? ""
          : "ข้ามไฟล์ที่ไม่ใช่ TXT หรือ DOCX แล้ว",
      );
    } catch {
      setUploadError(
        "อ่านไฟล์ TXT หรือ DOCX ไม่สำเร็จ ลองเลือกไฟล์ใหม่อีกครั้ง",
      );
    }
  }

  async function handleMangaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    try {
      const imagePages = await Promise.all(files.map(readFileAsDataUrl));
      setMangaData((prev) => ({
        ...prev,
        imagePages: [...getFilledPages(prev.imagePages), ...imagePages],
      }));
      setUploadError("");
    } catch {
      setUploadError("อ่านไฟล์ภาพไม่สำเร็จ ลองเลือกไฟล์ใหม่อีกครั้ง");
    }
  }

  async function handleAudioUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const audioUrl = await readFileAsDataUrl(file);
      setAudioData((prev) => ({ ...prev, audioUrl }));
      setUploadError("");
    } catch {
      setUploadError("อ่านไฟล์เสียงไม่สำเร็จ ลองเลือกไฟล์ใหม่อีกครั้ง");
    }
  }

  function saveEpisode(nextStatus: "draft" | "scheduled" | "published") {
    const promotion = getPromotionPayload();

    if (
      priceMode === "paid" &&
      (coinPrice < episodePricePolicy.minCoins ||
        coinPrice > episodePricePolicy.maxCoins)
    ) {
      setUploadError(
        `ราคาต่อตอนต้องอยู่ระหว่าง ${episodePricePolicy.minCoins}-${episodePricePolicy.maxCoins} coins`,
      );
      return;
    }

    if (priceMode === "paid" && promotionEnabled && !promotion) {
      setUploadError("กรุณากำหนดส่วนลด 1-100% และช่วงวันที่โปรโมชันให้ถูกต้อง");
      return;
    }

    if (isNovelBatchMode) {
      const draftsToSave = getImportedDraftsWithCurrentEditor();
      const hasMissingTitle = draftsToSave.some((draft) => !draft.title.trim());

      if (hasMissingTitle) {
        setUploadError("กรุณาตั้งชื่อตอนให้ครบทุกไฟล์ก่อนบันทึก");
        return;
      }

      draftsToSave.forEach((draft) => {
        createEpisode({
          workId: activeWork.id,
          type: "novel",
          number: draft.number,
          title: draft.title.trim(),
          status: nextStatus,
          price: normalizedPrice(),
          promotion,
          releaseDate: draft.releaseDate,
          typeSpecificData: {
            content: draft.content,
            wordCount: draft.wordCount,
            sourceFormat: draft.sourceFormat,
            sourceFileName: draft.fileName,
            layoutHtml: draft.layoutHtml,
            layoutCss: draft.layoutCss,
          },
        });
      });

      router.push(`/creator/works/${activeWork.id}`);
      return;
    }

    if (!title.trim()) return;

    if (mode === "create") {
      const createdEpisode = createEpisode({
        workId: activeWork.id,
        type: episodeType,
        number,
        title: title.trim(),
        status: nextStatus,
        price: normalizedPrice(),
        promotion,
        releaseDate,
        typeSpecificData:
          episodeType === "novel"
            ? {
                content: editor?.getHTML() ?? "",
                wordCount:
                  editor?.getText().trim().split(/\s+/).filter(Boolean)
                    .length ?? 0,
                sourceFormat: "editor",
              }
            : episodeType === "manga"
              ? mangaData
              : audioData,
      });

      router.push(`/creator/works/${createdEpisode.workId}`);
      return;
    }

    updateEpisode(existingEpisode!.id, {
      number,
      title: title.trim(),
      status: nextStatus,
      price: normalizedPrice(),
      promotion,
      releaseDate,
      typeSpecificData:
        episodeType === "novel"
          ? initialNovelData.sourceFormat === "docx"
            ? initialNovelData
            : {
                content: editor?.getHTML() ?? "",
                wordCount:
                  editor?.getText().trim().split(/\s+/).filter(Boolean)
                    .length ?? 0,
                sourceFormat: initialNovelData.sourceFormat ?? "editor",
                sourceFileName: initialNovelData.sourceFileName,
                layoutHtml: initialNovelData.layoutHtml,
                layoutCss: initialNovelData.layoutCss,
              }
          : episodeType === "manga"
            ? mangaData
            : audioData,
    });
    router.push(`/creator/works/${activeWork.id}`);
  }

  return (
    <div className="p-6 pb-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {mode === "create" ? "เพิ่มตอนใหม่" : "แก้ไขตอน"} • {work.title}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            ประเภทผลงานหลักคือ {CREATOR_WORK_TYPE_LABELS[work.type]}{" "}
            แต่แต่ละตอนเลือกประเภทเนื้อหาได้
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push(`/creator/works/${work.id}`)}
        >
          กลับไปหน้ารายละเอียดนิยาย
        </Button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="border border-border p-6">
          <div className="space-y-4">
            <div>
              <FieldLabel>ประเภทตอน</FieldLabel>
              {mode === "create" ? (
                <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                  {(["novel", "manga", "audiobook"] as CreatorWorkType[]).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setEpisodeType(type);
                          setUploadError("");
                          setImportedNovelDrafts([]);
                          setSelectedImportedDraftId(null);
                          editor?.commands.clearContent();
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                          episodeType === type
                            ? "border-primary bg-primary-light text-primary"
                            : "border-border bg-white text-text-muted hover:border-primary/40 hover:text-text-primary"
                        }`}
                      >
                        {CREATOR_WORK_TYPE_LABELS[type]}
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-1.5 rounded-xl border border-border bg-accent px-3 py-2.5 text-sm font-semibold text-text-primary">
                  {CREATOR_WORK_TYPE_LABELS[episodeType]}
                </p>
              )}
              <p className="mt-1.5 text-xs text-text-muted">
                {mode === "edit"
                  ? "ล็อกประเภทตอนเดิมไว้เพื่อป้องกันข้อมูลเฉพาะประเภทสูญหาย"
                  : `ค่าเริ่มต้นอิงจากประเภทผลงานหลัก: ${CREATOR_WORK_TYPE_LABELS[work.type]}`}
              </p>
            </div>

            <div>
              <FieldLabel>ชื่อตอน</FieldLabel>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={isNovelBatchMode}
                className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="ตั้งชื่อตอน"
              />
              {isNovelBatchMode && (
                <p className="mt-1.5 text-xs text-text-muted">
                  ใช้ชื่อตอนจากรายการไฟล์ด้านขวาแทน
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>ลำดับตอน</FieldLabel>
                <input
                  type="number"
                  min={1}
                  value={number}
                  onChange={(event) => {
                    const nextNumberValue = Number(event.target.value) || 1;
                    setNumber(nextNumberValue);
                    if (isNovelBatchMode) {
                      setImportedNovelDrafts((prev) =>
                        renumberImportedEpisodes(prev, nextNumberValue),
                      );
                    }
                  }}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <FieldLabel>สถานะ</FieldLabel>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as "draft" | "scheduled" | "published",
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="draft">ฉบับร่าง</option>
                  <option value="scheduled">ตั้งเวลา</option>
                  <option value="published">เผยแพร่แล้ว</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>วันเผยแพร่</FieldLabel>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(event) => setReleaseDate(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <FieldLabel>ราคา</FieldLabel>
                <select
                  value={priceMode}
                  data-testid="episode-price-mode"
                  onChange={(event) => {
                    const nextPriceMode = event.target.value as "free" | "paid";
                    setPriceMode(nextPriceMode);
                    if (nextPriceMode === "paid" && coinPrice === 0) {
                      setCoinPrice(episodePricePolicy.recommendedCoins);
                    }
                    if (nextPriceMode === "free") {
                      setPromotionEnabled(false);
                    }
                  }}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="free">ฟรี</option>
                  <option value="paid">เก็บ coins</option>
                </select>
              </div>
            </div>

            {priceMode === "paid" && (
              <div>
                <FieldLabel>จำนวน coins</FieldLabel>
                <input
                  type="number"
                  min={episodePricePolicy.minCoins}
                  max={episodePricePolicy.maxCoins}
                  value={coinPrice}
                  data-testid="episode-coin-price"
                  onChange={(event) => setCoinPrice(Number(event.target.value) || 0)}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <p className="mt-1.5 text-xs text-text-muted">
                  แอดมินกำหนดช่วง {episodePricePolicy.minCoins}-{episodePricePolicy.maxCoins} coins
                  · แนะนำ {episodePricePolicy.recommendedCoins} coins
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-accent/40 p-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={promotionEnabled}
                  disabled={priceMode === "free"}
                  onChange={(event) => setPromotionEnabled(event.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 disabled:opacity-50"
                  data-testid="episode-promotion-toggle"
                />
                <span className="text-sm font-semibold text-text-primary">
                  เปิดโปรโมชันรายตอน
                </span>
              </label>
              {priceMode === "free" && (
                <p className="mt-2 text-xs text-text-muted">
                  ตอนฟรีไม่ต้องตั้งโปรโมชันลดราคา
                </p>
              )}

              {promotionEnabled && priceMode === "paid" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <FieldLabel>ส่วนลด (%)</FieldLabel>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={promotionDiscount}
                      onChange={(event) =>
                        setPromotionDiscount(Number(event.target.value) || 0)
                      }
                      className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                      data-testid="episode-promotion-discount"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel>วันเริ่มโปร</FieldLabel>
                      <input
                        type="date"
                        value={promotionStartDate}
                        onChange={(event) => setPromotionStartDate(event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                        data-testid="episode-promotion-start"
                      />
                    </div>
                    <div>
                      <FieldLabel>วันสิ้นสุดโปร</FieldLabel>
                      <input
                        type="date"
                        value={promotionEndDate}
                        onChange={(event) => setPromotionEndDate(event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                        data-testid="episode-promotion-end"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div>
          {episodeType === "novel" && (
            <div className="space-y-4">
              {mode === "create" && (
                <Card className="border border-border p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">
                        นำเข้า TXT / DOCX หลายตอน
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        1 ไฟล์จะกลายเป็น 1 ตอน โดย DOCX จะแสดง preview
                        เพื่อคงหน้ากระดาษ
                      </p>
                    </div>
                    <label
                      htmlFor="novel-file-upload"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover"
                    >
                      <Upload size={16} />
                      อัปโหลด TXT / DOCX
                    </label>
                    <input
                      id="novel-file-upload"
                      type="file"
                      accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      multiple
                      onChange={(event) => void handleNovelUpload(event)}
                      className="sr-only"
                    />
                  </div>
                  {uploadError && (
                    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                      {uploadError}
                    </p>
                  )}
                </Card>
              )}

              {isNovelBatchMode && (
                <Card className="border border-border p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-text-primary">
                      จัดการตอนจากไฟล์นำเข้า
                    </h2>
                    <p className="text-sm text-text-muted">
                      {importedNovelDrafts.length} ตอนพร้อมบันทึก
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {importedNovelDrafts.map((draft, index) => (
                      <div
                        key={draft.id}
                        data-testid="novel-import-draft"
                        className={`rounded-2xl border p-4 transition-colors ${
                          draft.id === selectedImportedDraftId
                            ? "border-primary bg-primary-light/30"
                            : "border-border bg-white"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => selectImportedDraft(draft.id)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <p className="truncate font-semibold text-text-primary">
                              ตอนที่ {draft.number}:{" "}
                              {draft.title || "ยังไม่ได้ตั้งชื่อ"}
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                              {draft.fileName} •{" "}
                              {draft.sourceFormat.toUpperCase()} •{" "}
                              {draft.wordCount} คำ
                            </p>
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveImportedDraft(draft.id, -1)}
                              aria-label={`ย้ายตอน ${draft.title || index + 1} ขึ้น`}
                              className="rounded-lg p-2 text-text-muted hover:bg-accent hover:text-text-primary disabled:cursor-default disabled:opacity-30"
                            >
                              <ArrowUp size={15} />
                            </button>
                            <button
                              type="button"
                              disabled={
                                index === importedNovelDrafts.length - 1
                              }
                              onClick={() => moveImportedDraft(draft.id, 1)}
                              aria-label={`ย้ายตอน ${draft.title || index + 1} ลง`}
                              className="rounded-lg p-2 text-text-muted hover:bg-accent hover:text-text-primary disabled:cursor-default disabled:opacity-30"
                            >
                              <ArrowDown size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImportedDraft(draft.id)}
                              aria-label={`ลบตอน ${draft.title || index + 1}`}
                              className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-[120px_minmax(0,1fr)_160px]">
                          <div>
                            <FieldLabel>ลำดับตอน</FieldLabel>
                            <input
                              type="number"
                              min={1}
                              value={draft.number}
                              onChange={(event) =>
                                updateImportedDraft(draft.id, {
                                  number: Number(event.target.value) || 1,
                                })
                              }
                              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                            />
                          </div>
                          <div>
                            <FieldLabel>ชื่อตอน</FieldLabel>
                            <input
                              value={draft.title}
                              onChange={(event) =>
                                updateImportedDraft(draft.id, {
                                  title: event.target.value,
                                })
                              }
                              placeholder="ตั้งชื่อตอน"
                              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                            />
                          </div>
                          <div>
                            <FieldLabel>วันเผยแพร่</FieldLabel>
                            <input
                              type="date"
                              value={draft.releaseDate}
                              onChange={(event) =>
                                updateImportedDraft(draft.id, {
                                  releaseDate: event.target.value,
                                })
                              }
                              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {selectedImportedDraftIsDocx &&
              selectedImportedDraft?.layoutHtml ? (
                <DocxLayoutPreview
                  html={selectedImportedDraft.layoutHtml}
                  css={selectedImportedDraft.layoutCss ?? ""}
                  fileName={selectedImportedDraft.fileName}
                />
              ) : initialNovelData.sourceFormat === "docx" &&
                initialNovelData.layoutHtml ? (
                <DocxLayoutPreview
                  html={initialNovelData.layoutHtml}
                  css={initialNovelData.layoutCss ?? ""}
                  fileName={initialNovelData.sourceFileName}
                />
              ) : (
                <Card className="overflow-hidden border border-border">
                  {isNovelBatchMode && selectedImportedDraft && (
                    <div className="border-b border-border bg-accent/50 px-4 py-3">
                      <p className="text-sm font-semibold text-text-primary">
                        แก้เนื้อหา: ตอนที่ {selectedImportedDraft.number}{" "}
                        {selectedImportedDraft.title || "ยังไม่ได้ตั้งชื่อ"}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-1 border-b border-border bg-white px-4 py-3">
                    <ToolbarButton
                      onClick={() => editor?.chain().focus().undo().run()}
                      disabled={!editor?.can().undo()}
                      title="เลิกทำ"
                    >
                      <Undo size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => editor?.chain().focus().redo().run()}
                      disabled={!editor?.can().redo()}
                      title="ทำซ้ำ"
                    >
                      <Redo size={16} />
                    </ToolbarButton>
                    <div className="mx-1 h-5 w-px bg-border" />
                    <ToolbarButton
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 1 })
                          .run()
                      }
                      active={editor?.isActive("heading", { level: 1 })}
                      title="หัวข้อ 1"
                    >
                      <Heading1 size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run()
                      }
                      active={editor?.isActive("heading", { level: 2 })}
                      title="หัวข้อ 2"
                    >
                      <Heading2 size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      active={editor?.isActive("bold")}
                      title="ตัวหนา"
                    >
                      <Bold size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      active={editor?.isActive("italic")}
                      title="ตัวเอียง"
                    >
                      <Italic size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                      }
                      active={editor?.isActive("bulletList")}
                      title="รายการหัวข้อ"
                    >
                      <List size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                      }
                      active={editor?.isActive("orderedList")}
                      title="รายการลำดับ"
                    >
                      <ListOrdered size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                      }
                      active={editor?.isActive("blockquote")}
                      title="อ้างอิง"
                    >
                      <Quote size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        editor?.chain().focus().setHorizontalRule().run()
                      }
                      title="เส้นคั่น"
                    >
                      <Minus size={16} />
                    </ToolbarButton>
                  </div>
                  <EditorContent editor={editor} />
                </Card>
              )}
            </div>
          )}

          {episodeType === "manga" && (
            <Card className="border border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-text-primary">
                  จัดการหน้าภาพ
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="manga-page-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-primary-hover"
                  >
                    <Upload size={15} />
                    อัปโหลดไฟล์ภาพหลายหน้า
                  </label>
                  <input
                    id="manga-page-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => void handleMangaUpload(event)}
                    className="sr-only"
                  />
                  <Button
                    size="sm"
                    onClick={() =>
                      setMangaData((prev) => ({
                        ...prev,
                        imagePages: [...prev.imagePages, ""],
                      }))
                    }
                  >
                    <Plus size={15} />
                    เพิ่มหน้า URL
                  </Button>
                </div>
              </div>
              {uploadError && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                  {uploadError}
                </p>
              )}

              <div className="mt-4 space-y-3">
                {mangaData.imagePages.map((pageUrl, index) => (
                  <div
                    key={`${index}-${pageUrl}`}
                    data-testid="manga-image-page"
                    className="rounded-2xl border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-text-primary">
                        หน้า {index + 1}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() =>
                            setMangaData((prev) => {
                              if (index === 0) return prev;
                              const nextPages = [...prev.imagePages];
                              [nextPages[index - 1], nextPages[index]] = [
                                nextPages[index],
                                nextPages[index - 1],
                              ];
                              return { ...prev, imagePages: nextPages };
                            })
                          }
                          aria-label={`ย้ายหน้า ${index + 1} ขึ้น`}
                          className="rounded-lg p-2 text-text-muted hover:bg-accent hover:text-text-primary disabled:cursor-default disabled:opacity-30"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={index === mangaData.imagePages.length - 1}
                          onClick={() =>
                            setMangaData((prev) => {
                              if (index === prev.imagePages.length - 1)
                                return prev;
                              const nextPages = [...prev.imagePages];
                              [nextPages[index + 1], nextPages[index]] = [
                                nextPages[index],
                                nextPages[index + 1],
                              ];
                              return { ...prev, imagePages: nextPages };
                            })
                          }
                          aria-label={`ย้ายหน้า ${index + 1} ลง`}
                          className="rounded-lg p-2 text-text-muted hover:bg-accent hover:text-text-primary disabled:cursor-default disabled:opacity-30"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setMangaData((prev) => ({
                              ...prev,
                              imagePages: prev.imagePages.filter(
                                (_, pageIndex) => pageIndex !== index,
                              ),
                            }))
                          }
                          aria-label={`ลบหน้า ${index + 1}`}
                          className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    {pageUrl.trim() && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-accent">
                        {/* eslint-disable-next-line @next/next/no-img-element -- Episode previews accept data URLs and arbitrary mock URLs. */}
                        <img
                          src={pageUrl}
                          alt={`ตัวอย่างหน้า ${index + 1}`}
                          className="max-h-80 w-full object-contain"
                        />
                      </div>
                    )}
                    <input
                      value={pageUrl}
                      onChange={(event) =>
                        setMangaData((prev) => ({
                          ...prev,
                          imagePages: prev.imagePages.map((item, pageIndex) =>
                            pageIndex === index ? event.target.value : item,
                          ),
                        }))
                      }
                      placeholder="ใส่ URL ภาพ mock ของหน้านี้"
                      className="mt-3 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <FieldLabel>โน้ตเลย์เอาต์ของตอน</FieldLabel>
                <textarea
                  value={mangaData.layoutNotes}
                  onChange={(event) =>
                    setMangaData((prev) => ({
                      ...prev,
                      layoutNotes: event.target.value,
                    }))
                  }
                  rows={5}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  placeholder="อธิบาย flow การจัดหน้าและภาพสำคัญของตอนนี้"
                />
              </div>
            </Card>
          )}

          {episodeType === "audiobook" && (
            <Card className="border border-border p-6">
              <h2 className="text-lg font-bold text-text-primary">
                ข้อมูลเสียงของตอน
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <FieldLabel>อัปโหลดไฟล์เสียงตอนนี้</FieldLabel>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="audiobook-episode-upload"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover"
                    >
                      <Upload size={16} />
                      อัปโหลดไฟล์เสียง 1 ไฟล์
                    </label>
                    <input
                      id="audiobook-episode-upload"
                      type="file"
                      accept="audio/*"
                      onChange={(event) => void handleAudioUpload(event)}
                      className="sr-only"
                    />
                    <p className="text-sm text-text-muted">
                      เลือกไฟล์ใหม่จะแทนที่ไฟล์เดิมของตอนนี้
                    </p>
                  </div>
                  {uploadError && (
                    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                      {uploadError}
                    </p>
                  )}
                </div>
                <div>
                  <FieldLabel>ไฟล์เสียง (URL mock)</FieldLabel>
                  <input
                    value={audioData.audioUrl}
                    onChange={(event) =>
                      setAudioData((prev) => ({
                        ...prev,
                        audioUrl: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                  {audioData.audioUrl.trim() && (
                    <audio
                      controls
                      src={audioData.audioUrl}
                      className="mt-3 w-full"
                      data-testid="audiobook-audio-preview"
                    >
                      เบราว์เซอร์นี้ไม่รองรับตัวเล่นเสียง
                    </audio>
                  )}
                </div>
                <div>
                  <FieldLabel>ระยะเวลา (นาที)</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    value={audioData.durationMinutes}
                    onChange={(event) =>
                      setAudioData((prev) => ({
                        ...prev,
                        durationMinutes: Number(event.target.value) || 0,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <FieldLabel>Transcript / Script</FieldLabel>
                  <textarea
                    value={audioData.transcript}
                    onChange={(event) =>
                      setAudioData((prev) => ({
                        ...prev,
                        transcript: event.target.value,
                      }))
                    }
                    rows={12}
                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    placeholder="วางสคริปต์หรือ transcript ของตอนเสียง"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={() => saveEpisode("draft")}>
          บันทึกฉบับร่าง
        </Button>
        <Button variant="secondary" onClick={() => saveEpisode(status)}>
          บันทึกตามสถานะที่เลือก
        </Button>
        <Button onClick={() => saveEpisode("published")}>
          บันทึกและเผยแพร่
        </Button>
      </div>
    </div>
  );
}

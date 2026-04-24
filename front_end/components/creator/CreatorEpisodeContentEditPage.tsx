"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowLeft,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Save,
  Undo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import {
  CREATOR_EPISODE_STATUS_LABELS,
  CREATOR_WORK_TYPE_LABELS,
  type NovelEpisodeData,
} from "@/lib/creator-studio";

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
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

export default function CreatorEpisodeContentEditPage({
  workId,
  episodeId,
}: {
  workId: string;
  episodeId: string;
}) {
  const router = useRouter();
  const { getWorkById, getEpisodesByWorkId, updateEpisode } =
    useCreatorStudio();
  const work = getWorkById(workId);
  const episode = getEpisodesByWorkId(workId).find(
    (item) => item.id === episodeId,
  );
  const novelData =
    episode?.type === "novel"
      ? (episode.typeSpecificData as NovelEpisodeData)
      : undefined;
  const isDocxPreview = novelData?.sourceFormat === "docx" && novelData.layoutHtml;
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: novelData?.content ?? "",
    editorProps: {
      attributes: {
        class:
          "min-h-[520px] rounded-b-2xl border-x border-b border-border px-6 py-5 focus:outline-none prose prose-sm max-w-none text-text-primary",
      },
    },
  });

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

  if (!episode) {
    return (
      <div className="p-6">
        <Card className="border border-border p-6">
          <h1 className="text-xl font-bold text-text-primary">
            ไม่พบตอนที่ต้องการแก้ไขเนื้อหา
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

  if (episode.type !== "novel" || !novelData) {
    return (
      <div className="p-6">
        <Card className="border border-border p-6">
          <h1 className="text-xl font-bold text-text-primary">
            ตอนนี้ไม่ใช่นิยายเนื้อหา
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            ใช้หน้าแก้ไขตอนสำหรับจัดการตอนประเภท{" "}
            {CREATOR_WORK_TYPE_LABELS[episode.type]}
          </p>
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

  function saveContent() {
    if (!episode || !novelData) return;

    const content = isDocxPreview ? novelData.content : (editor?.getHTML() ?? "");
    const text = isDocxPreview ? "" : (editor?.getText() ?? "");

    updateEpisode(episode.id, {
      number: episode.number,
      title: episode.title,
      status: episode.status,
      price: episode.price,
      promotion: episode.promotion,
      releaseDate: episode.releaseDate,
      typeSpecificData: {
        content,
        wordCount: isDocxPreview ? novelData.wordCount : countWords(text),
        sourceFormat: novelData.sourceFormat ?? "editor",
        sourceFileName: novelData.sourceFileName,
        layoutHtml: novelData.layoutHtml,
        layoutCss: novelData.layoutCss,
      },
    });

    router.push(`/creator/works/${work.id}`);
  }

  return (
    <div className="p-6 pb-28">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Button
            variant="secondary"
            onClick={() => router.push(`/creator/works/${work.id}`)}
          >
            <ArrowLeft size={16} />
            กลับไปรายการตอน
          </Button>
          <h1 className="mt-5 text-2xl font-bold text-text-primary">
            แก้ไขเนื้อหา • {work.title}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            ตอนที่ {episode.number}: {episode.title}
          </p>
        </div>

        <Card className="border border-border p-4">
          <div className="grid gap-3 text-sm sm:grid-cols-4 lg:min-w-[520px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                ประเภท
              </p>
              <Badge className="mt-1.5" variant={episode.type}>
                {CREATOR_WORK_TYPE_LABELS[episode.type]}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                สถานะ
              </p>
              <Badge className="mt-1.5" variant={episode.status}>
                {CREATOR_EPISODE_STATUS_LABELS[episode.status]}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                วันเผยแพร่
              </p>
              <p className="mt-1.5 font-semibold text-text-primary">
                {episode.releaseDate}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                จำนวนคำ
              </p>
              <p className="mt-1.5 font-semibold text-text-primary">
                {novelData.wordCount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        {isDocxPreview ? (
          <DocxLayoutPreview
            html={novelData.layoutHtml ?? ""}
            css={novelData.layoutCss ?? ""}
            fileName={novelData.sourceFileName}
          />
        ) : (
          <Card className="overflow-hidden border border-border">
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
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
                active={editor?.isActive("heading", { level: 1 })}
                title="หัวข้อ 1"
              >
                <Heading1 size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
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
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                active={editor?.isActive("italic")}
                title="ตัวเอียง"
              >
                <Italic size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                active={editor?.isActive("bulletList")}
                title="รายการหัวข้อ"
              >
                <List size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                active={editor?.isActive("orderedList")}
                title="รายการลำดับ"
              >
                <ListOrdered size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                active={editor?.isActive("blockquote")}
                title="อ้างอิง"
              >
                <Quote size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                title="เส้นคั่น"
              >
                <Minus size={16} />
              </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
          </Card>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button
          variant="secondary"
          onClick={() => router.push(`/creator/works/${work.id}`)}
        >
          ยกเลิก
        </Button>
        <Button onClick={saveContent}>
          <Save size={16} />
          บันทึกเนื้อหา
        </Button>
      </div>
    </div>
  );
}

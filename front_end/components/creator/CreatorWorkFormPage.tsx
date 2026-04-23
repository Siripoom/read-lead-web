"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import {
  CREATOR_WORK_TYPE_LABELS,
  createEmptyWorkData,
  normalizePromotion,
  type AudiobookWorkData,
  type CreatorPromotion,
  type CreatorWork,
  type CreatorWorkStatus,
  type CreatorWorkType,
  type MangaWorkData,
  type NovelWorkData,
} from "@/lib/creator-studio";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
      {children}
    </label>
  );
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function TextField({ label, className, ...props }: TextFieldProps) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        {...props}
        className={`mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 ${className ?? ""}`}
      />
    </div>
  );
}

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

function TextAreaField({ label, className, ...props }: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        {...props}
        className={`mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 ${className ?? ""}`}
      />
    </div>
  );
}

function SelectField({
  label,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        {...props}
        className={`mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 ${className ?? ""}`}
      >
        {children}
      </select>
    </div>
  );
}

interface CreatorWorkFormPageProps {
  mode: "create" | "edit";
  type?: CreatorWorkType;
  workId?: string;
}

export default function CreatorWorkFormPage({
  mode,
  type,
  workId,
}: CreatorWorkFormPageProps) {
  const router = useRouter();
  const { getWorkById, createWork, updateWork } = useCreatorStudio();
  const existingWork = workId ? getWorkById(workId) : undefined;
  const resolvedType = existingWork?.type ?? type;

  if (!resolvedType) {
    return (
      <div className="p-6">
        <Card className="border border-border p-6">
          <h1 className="text-xl font-bold text-text-primary">ไม่พบประเภทนิยาย</h1>
          <p className="mt-2 text-sm text-text-muted">
            ประเภทที่ต้องการสร้างหรือแก้ไขไม่ถูกต้อง
          </p>
          <Button className="mt-4" onClick={() => router.push("/creator?tab=works")}>
            กลับไปรายการนิยาย
          </Button>
        </Card>
      </div>
    );
  }

  if (mode === "edit" && !existingWork) {
    return (
      <div className="p-6">
        <Card className="border border-border p-6">
          <h1 className="text-xl font-bold text-text-primary">ไม่พบนิยายเรื่องนี้</h1>
          <Button className="mt-4" onClick={() => router.push("/creator?tab=works")}>
            กลับไปรายการนิยาย
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <CreatorWorkFormContent
      key={existingWork ? `${existingWork.id}-${existingWork.updatedAt}` : `new-${resolvedType}`}
      mode={mode}
      workId={workId}
      existingWork={existingWork}
      resolvedType={resolvedType}
      onCreate={createWork}
      onUpdate={updateWork}
    />
  );
}

function CreatorWorkFormContent({
  mode,
  workId,
  existingWork,
  resolvedType,
  onCreate,
  onUpdate,
}: {
  mode: "create" | "edit";
  workId?: string;
  existingWork?: CreatorWork;
  resolvedType: CreatorWorkType;
  onCreate: ReturnType<typeof useCreatorStudio>["createWork"];
  onUpdate: ReturnType<typeof useCreatorStudio>["updateWork"];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(existingWork?.title ?? "");
  const [synopsis, setSynopsis] = useState(existingWork?.synopsis ?? "");
  const [cover, setCover] = useState(existingWork?.cover ?? "");
  const [tags, setTags] = useState(existingWork?.tags.join(", ") ?? "");
  const [reads, setReads] = useState(existingWork?.reads ?? "0");
  const [status, setStatus] = useState(existingWork?.status ?? "draft");
  const [promotionEnabled, setPromotionEnabled] = useState(Boolean(existingWork?.promotion));
  const [promotionDiscount, setPromotionDiscount] = useState(
    existingWork?.promotion?.discountPercent ?? 20,
  );
  const [promotionStartDate, setPromotionStartDate] = useState(
    existingWork?.promotion?.startDate ?? new Date().toISOString().slice(0, 10),
  );
  const [promotionEndDate, setPromotionEndDate] = useState(
    existingWork?.promotion?.endDate ?? new Date().toISOString().slice(0, 10),
  );
  const [formError, setFormError] = useState("");
  const [novelData, setNovelData] = useState<NovelWorkData>(
    (existingWork?.typeSpecificData as NovelWorkData) ??
      (createEmptyWorkData("novel") as NovelWorkData)
  );
  const [mangaData, setMangaData] = useState<MangaWorkData>(
    (existingWork?.typeSpecificData as MangaWorkData) ??
      (createEmptyWorkData("manga") as MangaWorkData)
  );
  const [audioData, setAudioData] = useState<AudiobookWorkData>(
    (existingWork?.typeSpecificData as AudiobookWorkData) ??
      (createEmptyWorkData("audiobook") as AudiobookWorkData)
  );

  function getTypeSpecificData() {
    if (resolvedType === "novel") return novelData;
    if (resolvedType === "manga") return mangaData;
    return audioData;
  }

  function getPromotionPayload(): CreatorPromotion | undefined {
    if (!promotionEnabled) return undefined;
    return normalizePromotion({
      discountPercent: promotionDiscount,
      startDate: promotionStartDate,
      endDate: promotionEndDate,
    });
  }

  function handleSubmit(nextStatus: CreatorWorkStatus) {
    const promotion = getPromotionPayload();

    if (promotionEnabled && !promotion) {
      setFormError("กรุณากำหนดส่วนลด 1-100% และช่วงวันที่โปรโมชันให้ถูกต้อง");
      return;
    }

    const payload = {
      title: title.trim(),
      type: resolvedType,
      status: nextStatus,
      synopsis: synopsis.trim(),
      cover: cover.trim() || "https://placehold.co/320x448/E5E7EB/111827?text=Cover",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      reads: reads.trim() || "0",
      revenue: existingWork?.revenue ?? 0,
      typeSpecificData: getTypeSpecificData(),
      promotion,
    };

    if (!payload.title) return;
    setFormError("");

    if (mode === "create") {
      const newWork = onCreate(payload);
      router.push(`/creator/works/${newWork.id}`);
      return;
    }

    onUpdate(workId!, payload);
    router.push(`/creator/works/${workId}`);
  }

  return (
    <div className="p-6 pb-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {mode === "create" ? "สร้างนิยายใหม่" : "แก้ไขข้อมูลนิยาย"} •{" "}
            {CREATOR_WORK_TYPE_LABELS[resolvedType]}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            ประเภทผลงานจะกำหนดรูปแบบจัดการตอนของเรื่องนี้ และเปลี่ยนไม่ได้หลังสร้าง
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            router.push(mode === "create" ? "/creator/works/new" : `/creator/works/${workId}`)
          }
        >
          กลับ
        </Button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <Card className="border border-border p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="ชื่อเรื่อง"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="ตั้งชื่อเรื่อง"
            />
            <TextField
              label="ปกนิยาย (URL mock)"
              value={cover}
              onChange={(event) => setCover(event.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="mt-4">
            <TextAreaField
              label="เรื่องย่อ"
              value={synopsis}
              onChange={(event) => setSynopsis(event.target.value)}
              rows={5}
              placeholder="เล่าให้คนอ่านรู้ว่าทำไมเรื่องนี้น่าติดตาม"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField
              label="แท็ก (คั่นด้วย comma)"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="แฟนตาซี, ลึกลับ, ดราม่า"
            />
            <TextField
              label="ยอดอ่าน mock"
              value={reads}
              onChange={(event) => setReads(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="mt-4">
            <SelectField
              label="สถานะปัจจุบัน"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "draft" | "pending" | "published")
              }
            >
              <option value="draft">ฉบับร่าง</option>
              <option value="pending">รอตรวจสอบ</option>
              <option value="published">เผยแพร่แล้ว</option>
            </SelectField>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-accent/40 p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={promotionEnabled}
                onChange={(event) => setPromotionEnabled(event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                data-testid="work-promotion-toggle"
              />
              <span className="text-sm font-semibold text-text-primary">
                เปิดโปรโมชันทั้งเรื่อง
              </span>
            </label>

            {promotionEnabled && (
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <TextField
                  label="ส่วนลด (%)"
                  type="number"
                  min={1}
                  max={100}
                  value={promotionDiscount}
                  onChange={(event) =>
                    setPromotionDiscount(Number(event.target.value) || 0)
                  }
                  data-testid="work-promotion-discount"
                />
                <TextField
                  label="วันเริ่มโปร"
                  type="date"
                  value={promotionStartDate}
                  onChange={(event) => setPromotionStartDate(event.target.value)}
                  data-testid="work-promotion-start"
                />
                <TextField
                  label="วันสิ้นสุดโปร"
                  type="date"
                  value={promotionEndDate}
                  onChange={(event) => setPromotionEndDate(event.target.value)}
                  data-testid="work-promotion-end"
                />
              </div>
            )}
          </div>

          {formError && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError}
            </p>
          )}
        </Card>

        <Card className="border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary">ฟอร์มเฉพาะประเภท</h2>
          {resolvedType === "novel" && (
            <div className="mt-4 space-y-4">
              <TextField
                label="สไตล์การเล่าเรื่อง"
                value={novelData.writingStyle}
                onChange={(event) =>
                  setNovelData((prev) => ({ ...prev, writingStyle: event.target.value }))
                }
              />
              <TextField
                label="เป้าหมายจำนวนตอน"
                value={novelData.targetLength}
                onChange={(event) =>
                  setNovelData((prev) => ({ ...prev, targetLength: event.target.value }))
                }
              />
              <TextAreaField
                label="Hook หลักของเรื่อง"
                value={novelData.audienceHook}
                onChange={(event) =>
                  setNovelData((prev) => ({ ...prev, audienceHook: event.target.value }))
                }
                rows={4}
              />
            </div>
          )}

          {resolvedType === "manga" && (
            <div className="mt-4 space-y-4">
              <TextField
                label="แนวภาพ"
                value={mangaData.artStyle}
                onChange={(event) =>
                  setMangaData((prev) => ({ ...prev, artStyle: event.target.value }))
                }
              />
              <SelectField
                label="ทิศทางการอ่าน"
                value={mangaData.pageDirection}
                onChange={(event) =>
                  setMangaData((prev) => ({
                    ...prev,
                    pageDirection: event.target.value as "ltr" | "rtl",
                  }))
                }
              >
                <option value="rtl">ขวาไปซ้าย</option>
                <option value="ltr">ซ้ายไปขวา</option>
              </SelectField>
              <TextField
                label="ขนาดแคนวาส"
                value={mangaData.canvasSize}
                onChange={(event) =>
                  setMangaData((prev) => ({ ...prev, canvasSize: event.target.value }))
                }
              />
            </div>
          )}

          {resolvedType === "audiobook" && (
            <div className="mt-4 space-y-4">
              <TextField
                label="ผู้บรรยาย"
                value={audioData.narrator}
                onChange={(event) =>
                  setAudioData((prev) => ({ ...prev, narrator: event.target.value }))
                }
              />
              <TextField
                label="โทนเสียง"
                value={audioData.voiceTone}
                onChange={(event) =>
                  setAudioData((prev) => ({ ...prev, voiceTone: event.target.value }))
                }
              />
              <TextField
                label="ระยะเวลาเฉลี่ยต่อตอน (นาที)"
                type="number"
                min={1}
                value={audioData.runtimeMinutes}
                onChange={(event) =>
                  setAudioData((prev) => ({
                    ...prev,
                    runtimeMinutes: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-accent/70 p-4">
            <p className="text-sm font-semibold text-text-primary">หมายเหตุการบันทึก</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              ปุ่มด้านล่างจะบันทึกข้อมูลทั้งหมดพร้อมกำหนดสถานะใหม่ของนิยายเรื่องนี้
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={() => handleSubmit(status)}>
          บันทึกตามสถานะปัจจุบัน
        </Button>
        <Button variant="secondary" onClick={() => handleSubmit("draft")}>
          บันทึกฉบับร่าง
        </Button>
        <Button onClick={() => handleSubmit(mode === "create" ? "pending" : "published")}>
          {mode === "create" ? "ส่งตรวจนิยาย" : "บันทึกและเผยแพร่"}
        </Button>
      </div>
    </div>
  );
}

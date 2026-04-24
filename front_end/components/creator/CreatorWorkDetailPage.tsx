"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit3, FileText, Plus, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DeleteConfirmModal from "@/components/creator/DeleteConfirmModal";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import {
  CREATOR_EPISODE_STATUS_LABELS,
  CREATOR_WORK_STATUS_LABELS,
  CREATOR_WORK_TYPE_LABELS,
  formatCreatorPrice,
  resolveEpisodePrice,
  type CreatorEpisode,
  type CreatorWork,
} from "@/lib/creator-studio";

function EpisodePriceCell({
  episode,
  work,
}: {
  episode: CreatorEpisode;
  work: CreatorWork;
}) {
  const resolvedPrice = resolveEpisodePrice(episode, work);

  if (!resolvedPrice.activePromotion) {
    return <span>{formatCreatorPrice(resolvedPrice.finalPrice)}</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted line-through">
          {formatCreatorPrice(resolvedPrice.originalPrice)}
        </span>
        <span className="font-semibold text-primary">
          {formatCreatorPrice(resolvedPrice.finalPrice)}
        </span>
        <Badge variant="paid">
          ลด {resolvedPrice.activePromotion.discountPercent}%
        </Badge>
      </div>
      <p className="text-xs text-text-muted">
        {resolvedPrice.activePromotion.scope === "episode"
          ? "โปรรายตอน"
          : "โปรทั้งเรื่อง"}
      </p>
    </div>
  );
}

export default function CreatorWorkDetailPage({ workId }: { workId: string }) {
  const router = useRouter();
  const { getWorkById, getEpisodesByWorkId, deleteWork, deleteEpisode } = useCreatorStudio();
  const [pendingDeleteWork, setPendingDeleteWork] = useState(false);
  const [pendingDeleteEpisodeId, setPendingDeleteEpisodeId] = useState<string | null>(null);
  const work = getWorkById(workId);
  const episodes = getEpisodesByWorkId(workId);
  const pendingEpisode = episodes.find((episode) => episode.id === pendingDeleteEpisodeId);

  if (!work) {
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
    <>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => router.push("/creator?tab=works")}>
            <ArrowLeft size={16} />
            กลับไปรายการนิยาย
          </Button>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => router.push(`/creator/works/${work.id}/edit`)}>
              <Edit3 size={16} />
              แก้ไขนิยาย
            </Button>
            <Button onClick={() => router.push(`/creator/works/${work.id}/episodes/new`)}>
              <Plus size={16} />
              เพิ่มตอน
            </Button>
            <Button variant="danger" onClick={() => setPendingDeleteWork(true)}>
              <Trash2 size={16} />
              ลบนิยาย
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="overflow-hidden border border-border">
            <div className="relative aspect-[4/5] w-full bg-accent">
              <Image
                src={work.cover}
                alt={work.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          </Card>

          <Card className="border border-border p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={work.type}>{CREATOR_WORK_TYPE_LABELS[work.type]}</Badge>
              <Badge variant={work.status}>{CREATOR_WORK_STATUS_LABELS[work.status]}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-text-primary">{work.title}</h1>
            <p className="mt-4 text-sm leading-7 text-text-muted">{work.synopsis}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-accent/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  ประเภทงาน
                </p>
                <p className="mt-2 font-semibold text-text-primary">
                  {CREATOR_WORK_TYPE_LABELS[work.type]}
                </p>
              </div>
              <div className="rounded-2xl bg-accent/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  จำนวนตอน
                </p>
                <p className="mt-2 font-semibold text-text-primary">{episodes.length}</p>
              </div>
              <div className="rounded-2xl bg-accent/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  ผู้อ่าน
                </p>
                <p className="mt-2 font-semibold text-text-primary">{work.reads}</p>
              </div>
              <div className="rounded-2xl bg-accent/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  รายได้
                </p>
                <p className="mt-2 font-semibold text-text-primary">
                  ฿{work.revenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-6 border border-border">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">รายการตอน</h2>
              <p className="text-sm text-text-muted">
                จัดการตอนของ {work.title} โดยแต่ละตอนเลือกประเภทเนื้อหาได้
              </p>
            </div>
            <Button onClick={() => router.push(`/creator/works/${work.id}/episodes/new`)}>
              <Plus size={16} />
              เพิ่มตอนใหม่
            </Button>
          </div>

          {episodes.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-base font-semibold text-text-primary">ยังไม่มีตอนในเรื่องนี้</p>
              <p className="mt-2 text-sm text-text-muted">
                เพิ่มตอนแรกเพื่อเริ่มจัดการ workflow ของ {CREATOR_WORK_TYPE_LABELS[work.type]}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-accent/60 text-left">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-text-muted">ตอน</th>
                    <th className="px-5 py-3 font-semibold text-text-muted">ประเภท</th>
                    <th className="px-5 py-3 font-semibold text-text-muted">ราคา</th>
                    <th className="px-5 py-3 font-semibold text-text-muted">สถานะ</th>
                    <th className="px-5 py-3 font-semibold text-text-muted">วันเผยแพร่</th>
                    <th className="px-5 py-3 font-semibold text-text-muted">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {episodes.map((episode, index) => (
                    <tr
                      key={episode.id}
                      className={index < episodes.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-text-primary">
                          ตอนที่ {episode.number}: {episode.title}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          แก้ไขล่าสุด {episode.updatedAt}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={episode.type}>
                          {CREATOR_WORK_TYPE_LABELS[episode.type]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-text-muted">
                        <EpisodePriceCell episode={episode} work={work} />
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={episode.status}>
                          {CREATOR_EPISODE_STATUS_LABELS[episode.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-text-muted">{episode.releaseDate}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {episode.type === "novel" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/creator/works/${work.id}/episodes/${episode.id}/content`
                                )
                              }
                            >
                              <FileText size={14} />
                              แก้ไขเนื้อหา
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              router.push(
                                `/creator/works/${work.id}/episodes/${episode.id}/edit`
                              )
                            }
                          >
                            แก้ไขตอน
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setPendingDeleteEpisodeId(episode.id)}
                          >
                            ลบตอน
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {pendingDeleteWork && (
        <DeleteConfirmModal
          title="ลบนิยายเรื่องนี้"
          description={`"${work.title}" และตอนทั้งหมดจะถูกลบออกทันทีจาก mock/local state`}
          confirmLabel="ลบนิยาย"
          onCancel={() => setPendingDeleteWork(false)}
          onConfirm={() => {
            deleteWork(work.id);
            router.push("/creator?tab=works");
          }}
        />
      )}

      {pendingEpisode && (
        <DeleteConfirmModal
          title="ลบตอนนี้"
          description={`ตอนที่ ${pendingEpisode.number}: ${pendingEpisode.title} จะถูกลบออกจากรายการตอนทันที`}
          confirmLabel="ลบตอน"
          onCancel={() => setPendingDeleteEpisodeId(null)}
          onConfirm={() => {
            deleteEpisode(pendingEpisode.id);
            setPendingDeleteEpisodeId(null);
          }}
        />
      )}
    </>
  );
}

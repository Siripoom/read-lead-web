"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Eye, Plus, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DeleteConfirmModal from "@/components/creator/DeleteConfirmModal";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import {
  CREATOR_WORK_STATUS_LABELS,
  CREATOR_WORK_TYPE_LABELS,
  type CreatorWork,
} from "@/lib/creator-studio";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString()}`;
}

export default function CreatorWorksPanel() {
  const router = useRouter();
  const { works, getEpisodesByWorkId, deleteWork } = useCreatorStudio();
  const [pendingDelete, setPendingDelete] = useState<CreatorWork | null>(null);

  return (
    <>
      <Card className="overflow-hidden border border-border" data-testid="creator-works-panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-text-primary">รายการนิยาย</h2>
            <p className="text-sm text-text-muted">
              จัดการนิยายทั้งหมด เลือกเข้าเรื่องเพื่อดูรายการตอนและแก้ไขตอน
            </p>
          </div>
          <Button onClick={() => router.push("/creator/works/new")}>
            <Plus size={16} />
            เพิ่มนิยาย
          </Button>
        </div>

        {works.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-base font-semibold text-text-primary">ยังไม่มีนิยายในสตูดิโอ</p>
            <p className="mt-2 text-sm text-text-muted">
              เริ่มจากเลือกประเภทผลงานก่อนสร้างเรื่องใหม่
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-accent/60 text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold text-text-muted">ชื่อเรื่อง</th>
                  <th className="px-5 py-3 font-semibold text-text-muted">ประเภท</th>
                  <th className="px-5 py-3 font-semibold text-text-muted">ตอน</th>
                  <th className="px-5 py-3 font-semibold text-text-muted">ผู้อ่าน</th>
                  <th className="px-5 py-3 font-semibold text-text-muted">รายได้</th>
                  <th className="px-5 py-3 font-semibold text-text-muted">สถานะ</th>
                  <th className="px-5 py-3 font-semibold text-text-muted">อัปเดตล่าสุด</th>
                  <th className="px-5 py-3 font-semibold text-text-muted">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {works.map((work, index) => {
                  const episodeCount = getEpisodesByWorkId(work.id).length;

                  return (
                    <tr
                      key={work.id}
                      className={index < works.length - 1 ? "border-b border-border" : ""}
                      data-testid={`creator-work-row-${work.id}`}
                    >
                      <td className="px-5 py-4">
                        <button
                          onClick={() => router.push(`/creator/works/${work.id}`)}
                          className="text-left font-semibold text-text-primary hover:text-primary"
                        >
                          {work.title}
                        </button>
                        <p className="mt-1 max-w-md truncate text-xs text-text-muted">
                          {work.synopsis}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={work.type}>{CREATOR_WORK_TYPE_LABELS[work.type]}</Badge>
                      </td>
                      <td className="px-5 py-4 text-text-muted">{episodeCount}</td>
                      <td className="px-5 py-4 text-text-muted">{work.reads}</td>
                      <td className="px-5 py-4 font-semibold text-text-primary">
                        {formatCurrency(work.revenue)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={work.status}>
                          {CREATOR_WORK_STATUS_LABELS[work.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-text-muted">{work.updatedAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => router.push(`/creator/works/${work.id}`)}
                            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-accent hover:text-text-primary"
                            title="ดูรายละเอียด"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => router.push(`/creator/works/${work.id}/edit`)}
                            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-accent hover:text-text-primary"
                            title="แก้ไขนิยาย"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setPendingDelete(work)}
                            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                            title="ลบนิยาย"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {pendingDelete && (
        <DeleteConfirmModal
          title="ลบนิยายเรื่องนี้"
          description={`เรื่อง "${pendingDelete.title}" และตอนทั้งหมดจะถูกลบออกจากสตูดิโอทันทีใน mock data`}
          confirmLabel="ลบนิยาย"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteWork(pendingDelete.id);
            setPendingDelete(null);
          }}
        />
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { BookCopy, Coins, Eye, PenTool } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import CreatorWorksPanel from "@/components/creator/CreatorWorksPanel";
import RevenueChart from "@/components/creator/RevenueChart";
import WithdrawButton from "@/components/creator/WithdrawButton";
import { useCreatorStudio } from "@/context/CreatorStudioContext";
import { CREATOR_WORK_TYPE_LABELS } from "@/lib/creator-studio";

interface CreatorStudioHomeProps {
  activeTab: "overview" | "works";
}

export default function CreatorStudioHome({ activeTab }: CreatorStudioHomeProps) {
  const { works, episodes, getEpisodesByWorkId } = useCreatorStudio();
  const publishedWorks = works.filter((work) => work.status === "published");
  const totalRevenue = works.reduce((sum, work) => sum + work.revenue, 0);
  const latestWorks = [...works].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt)
  );

  return (
    <div className="p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">สตูดิโอนักเขียน</h1>
          <p className="mt-1 text-sm text-text-muted">
            ดูภาพรวมผลงานหรือเข้าไปจัดการนิยายและตอนตามประเภทงาน
          </p>
        </div>
        <WithdrawButton />
      </div>

      <div className="mt-6 flex w-fit gap-1 rounded-2xl border border-border bg-white p-1">
        <Link
          href="/creator?tab=overview"
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "overview"
              ? "bg-primary text-white"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Overview
        </Link>
        <Link
          href="/creator?tab=works"
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "works"
              ? "bg-primary text-white"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          จัดการนิยาย
        </Link>
      </div>

      {activeTab === "overview" ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Coins size={20} className="text-primary" />}
              label="รายได้รวม"
              value={`฿${totalRevenue.toLocaleString()}`}
              trend="อัปเดตจากผลงานทั้งหมด"
              trendUp
            />
            <StatCard
              icon={<BookCopy size={20} className="text-primary" />}
              label="นิยายทั้งหมด"
              value={String(works.length)}
              trend={`${publishedWorks.length} เรื่องเผยแพร่แล้ว`}
              trendUp
            />
            <StatCard
              icon={<PenTool size={20} className="text-primary" />}
              label="ตอนทั้งหมด"
              value={String(episodes.length)}
              trend="รวมทุกประเภทผลงาน"
              trendUp
            />
            <StatCard
              icon={<Eye size={20} className="text-primary" />}
              label="ผู้อ่านรวม"
              value={works.map((work) => work.reads).join(" / ")}
              trend="ค่า mock จากผลงานที่มีอยู่"
              trendUp
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <RevenueChart />
            <Card className="border border-border p-5">
              <h2 className="text-lg font-bold text-text-primary">อัปเดตล่าสุด</h2>
              <div className="mt-4 space-y-3">
                {latestWorks.slice(0, 4).map((work) => (
                  <div
                    key={work.id}
                    className="rounded-2xl border border-border px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-text-primary">{work.title}</p>
                        <p className="mt-1 text-xs text-text-muted">
                          {CREATOR_WORK_TYPE_LABELS[work.type]} •{" "}
                          {getEpisodesByWorkId(work.id).length} ตอน
                        </p>
                      </div>
                      <span className="text-xs font-medium text-text-muted">
                        {work.updatedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <CreatorWorksPanel />
        </div>
      )}
    </div>
  );
}

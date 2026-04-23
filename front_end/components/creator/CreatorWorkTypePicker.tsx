"use client";

import { useRouter } from "next/navigation";
import { BookOpenText, Headphones, Images } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  CREATOR_TYPE_DESCRIPTIONS,
  CREATOR_WORK_TYPE_LABELS,
  type CreatorWorkType,
} from "@/lib/creator-studio";

const TYPE_ICONS = {
  novel: BookOpenText,
  manga: Images,
  audiobook: Headphones,
};

const TYPES: CreatorWorkType[] = ["novel", "manga", "audiobook"];

export default function CreatorWorkTypePicker() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">เลือกประเภทนิยาย</h1>
          <p className="mt-1 text-sm text-text-muted">
            ประเภทที่เลือกจะกำหนดฟอร์มจัดการเรื่องและรูปแบบตอนในขั้นถัดไป
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push("/creator?tab=works")}>
          กลับไปรายการนิยาย
        </Button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {TYPES.map((type) => {
          const Icon = TYPE_ICONS[type];
          return (
            <Card key={type} className="border border-border p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
                <Icon size={22} className="text-primary" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-text-primary">
                {CREATOR_WORK_TYPE_LABELS[type]}
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {CREATOR_TYPE_DESCRIPTIONS[type]}
              </p>
              <Button className="mt-6 w-full" onClick={() => router.push(`/creator/works/new/${type}`)}>
                ใช้ประเภทนี้
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

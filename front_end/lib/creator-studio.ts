export type CreatorWorkType = "novel" | "manga" | "audiobook";
export type CreatorWorkStatus = "draft" | "pending" | "published";
export type CreatorEpisodeStatus = "draft" | "scheduled" | "published";
export type CreatorPromotionScope = "work" | "episode";

export interface CreatorPromotion {
  discountPercent: number;
  startDate: string;
  endDate: string;
}

export interface ResolvedEpisodePrice {
  originalPrice: "free" | number;
  finalPrice: "free" | number;
  activePromotion?: CreatorPromotion & { scope: CreatorPromotionScope };
}

export interface CreatorWorkBase {
  id: string;
  title: string;
  type: CreatorWorkType;
  status: CreatorWorkStatus;
  synopsis: string;
  cover: string;
  tags: string[];
  reads: string;
  revenue: number;
  updatedAt: string;
  promotion?: CreatorPromotion;
}

export interface NovelWorkData {
  writingStyle: string;
  targetLength: string;
  audienceHook: string;
}

export interface MangaWorkData {
  artStyle: string;
  pageDirection: "ltr" | "rtl";
  canvasSize: string;
}

export interface AudiobookWorkData {
  narrator: string;
  voiceTone: string;
  runtimeMinutes: number;
}

export type CreatorWorkTypeSpecificData =
  | NovelWorkData
  | MangaWorkData
  | AudiobookWorkData;

export interface CreatorWork extends CreatorWorkBase {
  typeSpecificData: CreatorWorkTypeSpecificData;
}

export interface CreatorEpisodeBase {
  id: string;
  workId: string;
  number: number;
  title: string;
  status: CreatorEpisodeStatus;
  price: "free" | number;
  promotion?: CreatorPromotion;
  releaseDate: string;
  updatedAt: string;
}

export interface NovelEpisodeData {
  content: string;
  wordCount: number;
  sourceFormat?: "editor" | "txt" | "docx";
  sourceFileName?: string;
  layoutHtml?: string;
  layoutCss?: string;
}

export interface MangaEpisodeData {
  imagePages: string[];
  layoutNotes: string;
}

export interface AudiobookEpisodeData {
  audioUrl: string;
  durationMinutes: number;
  transcript: string;
}

export type CreatorEpisodeTypeSpecificData =
  | NovelEpisodeData
  | MangaEpisodeData
  | AudiobookEpisodeData;

export interface CreatorEpisode extends CreatorEpisodeBase {
  type: CreatorWorkType;
  typeSpecificData: CreatorEpisodeTypeSpecificData;
}

export const CREATOR_STUDIO_STORAGE_KEY = "readlead_creator_studio";

export const CREATOR_WORK_TYPE_LABELS: Record<CreatorWorkType, string> = {
  novel: "นิยายเนื้อหา",
  manga: "ภาพ",
  audiobook: "นิยายเสียง",
};

export const CREATOR_WORK_STATUS_LABELS: Record<CreatorWorkStatus, string> = {
  draft: "ฉบับร่าง",
  pending: "รอตรวจสอบ",
  published: "เผยแพร่แล้ว",
};

export const CREATOR_EPISODE_STATUS_LABELS: Record<CreatorEpisodeStatus, string> = {
  draft: "ฉบับร่าง",
  scheduled: "ตั้งเวลา",
  published: "เผยแพร่แล้ว",
};

export const CREATOR_TYPE_DESCRIPTIONS: Record<CreatorWorkType, string> = {
  novel: "สร้างเรื่องแบบบทบรรยายเต็มตอน ด้วยตัวแก้ไขข้อความยาว",
  manga: "จัดการตอนแบบภาพต่อหน้า พร้อมลำดับหน้าและโน้ตงานวาด",
  audiobook: "ปล่อยตอนเสียงพร้อมข้อมูลผู้บรรยาย ระยะเวลา และสคริปต์",
};

export function getTodayDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function normalizePromotion(
  promotion: CreatorPromotion | undefined,
): CreatorPromotion | undefined {
  if (!promotion?.startDate || !promotion.endDate) return undefined;

  const discountPercent = Math.min(
    100,
    Math.max(1, Math.floor(Number(promotion.discountPercent) || 0)),
  );

  if (!discountPercent || promotion.endDate < promotion.startDate) {
    return undefined;
  }

  return {
    discountPercent,
    startDate: promotion.startDate,
    endDate: promotion.endDate,
  };
}

export function isPromotionActive(
  promotion: CreatorPromotion | undefined,
  today = getTodayDateString(),
) {
  const normalizedPromotion = normalizePromotion(promotion);
  if (!normalizedPromotion) return false;

  return (
    normalizedPromotion.startDate <= today &&
    today <= normalizedPromotion.endDate
  );
}

function applyDiscount(price: number, discountPercent: number) {
  if (discountPercent >= 100) return 0;
  return Math.max(1, Math.floor(price * (100 - discountPercent) / 100));
}

export function resolveEpisodePrice(
  episode: Pick<CreatorEpisode, "price" | "promotion">,
  work?: Pick<CreatorWork, "promotion">,
  today = getTodayDateString(),
): ResolvedEpisodePrice {
  if (episode.price === "free") {
    return {
      originalPrice: "free",
      finalPrice: "free",
    };
  }

  const episodePromotion = normalizePromotion(episode.promotion);
  const workPromotion = normalizePromotion(work?.promotion);
  const activePromotion = isPromotionActive(episodePromotion, today)
    ? { ...episodePromotion!, scope: "episode" as const }
    : isPromotionActive(workPromotion, today)
      ? { ...workPromotion!, scope: "work" as const }
      : undefined;

  if (!activePromotion) {
    return {
      originalPrice: episode.price,
      finalPrice: episode.price,
    };
  }

  const discountedPrice = applyDiscount(
    episode.price,
    activePromotion.discountPercent,
  );

  return {
    originalPrice: episode.price,
    finalPrice: discountedPrice === 0 ? "free" : discountedPrice,
    activePromotion,
  };
}

export function formatCreatorPrice(price: "free" | number) {
  return price === "free" ? "ฟรี" : `${price} coins`;
}

export function createEmptyWorkData(type: CreatorWorkType): CreatorWorkTypeSpecificData {
  switch (type) {
    case "novel":
      return {
        writingStyle: "เล่าเรื่องมุมมองบุคคลที่หนึ่ง",
        targetLength: "40 ตอน",
        audienceHook: "",
      };
    case "manga":
      return {
        artStyle: "เส้นคม โทนดาร์กแฟนตาซี",
        pageDirection: "rtl",
        canvasSize: "800x1280",
      };
    case "audiobook":
      return {
        narrator: "",
        voiceTone: "อบอุ่น ลึกลับ",
        runtimeMinutes: 18,
      };
  }
}

export function createEmptyEpisodeData(type: CreatorWorkType): CreatorEpisodeTypeSpecificData {
  switch (type) {
    case "novel":
      return {
        content: "",
        wordCount: 0,
      };
    case "manga":
      return {
        imagePages: ["", "", ""],
        layoutNotes: "",
      };
    case "audiobook":
      return {
        audioUrl: "",
        durationMinutes: 15,
        transcript: "",
      };
  }
}

export interface CreatorStudioSeed {
  works: CreatorWork[];
  episodes: CreatorEpisode[];
}

export const CREATOR_STUDIO_SEED: CreatorStudioSeed = {
  works: [
    {
      id: "work-obsidian-chronicles",
      title: "The Obsidian Chronicles",
      type: "novel",
      status: "published",
      synopsis:
        "นักเก็บเอกสารผู้ได้ยินเสียงจากห้องนิรภัยต้องเลือกว่าจะปกป้องความจริงหรือปล่อยให้โลกสิ้นสุดลงอย่างสงบ",
      cover: "https://placehold.co/320x448/2D1B69/white?text=Obsidian",
      tags: ["แฟนตาซี", "ลึกลับ", "ดราม่า"],
      reads: "134k",
      revenue: 45200,
      updatedAt: "12 เม.ย. 2026",
      typeSpecificData: {
        writingStyle: "เล่าเรื่องมุมมองบุคคลที่สาม",
        targetLength: "60 ตอน",
        audienceHook: "ห้องนิรภัยที่เรียกชื่อคนเป็นและคนตาย",
      },
    },
    {
      id: "work-dark-meridian",
      title: "Dark Meridian",
      type: "manga",
      status: "published",
      synopsis:
        "เมืองที่ไม่มีพระอาทิตย์ซ่อนสงครามของนักล่าภูตไว้ใต้เงาตึก ผู้รอดชีวิตต้องเลือกความเป็นมนุษย์หรือพลังมืด",
      cover: "https://placehold.co/320x448/111827/white?text=Dark+Meridian",
      tags: ["แอ็กชัน", "แฟนตาซี", "ภาพ"],
      reads: "89k",
      revenue: 28700,
      updatedAt: "11 เม.ย. 2026",
      typeSpecificData: {
        artStyle: "คอนทราสต์จัด ฉากกลางคืนจัดเต็ม",
        pageDirection: "rtl",
        canvasSize: "1600x2560",
      },
    },
    {
      id: "work-voices-in-the-void",
      title: "Voices in the Void",
      type: "audiobook",
      status: "draft",
      synopsis:
        "นักบินหญิงรับฟังเสียงลึกลับจากความว่างเปล่าระหว่างดวงดาวและพบว่ามันพูดถึงเธอก่อนกำเนิด",
      cover: "https://placehold.co/320x448/0a1a2e/white?text=Voices+in+the+Void",
      tags: ["ไซไฟ", "ระทึกขวัญ", "นิยายเสียง"],
      reads: "23k",
      revenue: 0,
      updatedAt: "10 เม.ย. 2026",
      typeSpecificData: {
        narrator: "Lyra Voss",
        voiceTone: "สงบ ละเมียด และค่อย ๆ กดดัน",
        runtimeMinutes: 22,
      },
    },
  ],
  episodes: [
    {
      id: "ep-obsidian-1",
      workId: "work-obsidian-chronicles",
      type: "novel",
      number: 1,
      title: "The Beginning of the End",
      status: "published",
      price: "free",
      releaseDate: "2026-01-15",
      updatedAt: "2026-04-11",
      typeSpecificData: {
        content:
          "<p>The archive smelled of forgotten centuries. Sera pressed her palm against the obsidian door and the vault answered back.</p><p>Some doors were never meant to be opened. This one had been calling her by name.</p>",
        wordCount: 1280,
      },
    },
    {
      id: "ep-obsidian-2",
      workId: "work-obsidian-chronicles",
      type: "novel",
      number: 2,
      title: "Shadows in the Archive",
      status: "published",
      price: 3,
      releaseDate: "2026-01-22",
      updatedAt: "2026-04-10",
      typeSpecificData: {
        content:
          "<p>The door opened into a darkness that felt awake. Names burned along the wall like a warning.</p>",
        wordCount: 1140,
      },
    },
    {
      id: "ep-dark-1",
      workId: "work-dark-meridian",
      type: "manga",
      number: 1,
      title: "คืนแรกของผู้ล่า",
      status: "published",
      price: "free",
      releaseDate: "2026-02-03",
      updatedAt: "2026-04-09",
      typeSpecificData: {
        imagePages: [
          "https://placehold.co/800x1280/111827/white?text=Page+1",
          "https://placehold.co/800x1280/1f2937/white?text=Page+2",
          "https://placehold.co/800x1280/374151/white?text=Page+3",
        ],
        layoutNotes: "เปิดตอนด้วย splash page ก่อนตัดเข้าฉากล่ากลางตรอก",
      },
    },
    {
      id: "ep-dark-2",
      workId: "work-dark-meridian",
      type: "manga",
      number: 2,
      title: "เสียงกระซิบหลังตึก",
      status: "draft",
      price: 5,
      releaseDate: "2026-02-10",
      updatedAt: "2026-04-08",
      typeSpecificData: {
        imagePages: [
          "https://placehold.co/800x1280/0f172a/white?text=Page+1",
          "https://placehold.co/800x1280/1e293b/white?text=Page+2",
        ],
        layoutNotes: "เน้น panel แคบ ๆ สลับ close-up สายตาตัวละคร",
      },
    },
    {
      id: "ep-void-1",
      workId: "work-voices-in-the-void",
      type: "audiobook",
      number: 1,
      title: "Signal From Nobody",
      status: "draft",
      price: "free",
      releaseDate: "2026-03-01",
      updatedAt: "2026-04-07",
      typeSpecificData: {
        audioUrl: "https://example.com/audio/signal-from-nobody.mp3",
        durationMinutes: 18,
        transcript:
          "Captain Elian heard the signal on the third silent orbit. It was not language at first, but grief rendered as frequency.",
      },
    },
  ],
};

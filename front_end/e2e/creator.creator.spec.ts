import { test, expect, type Page } from "@playwright/test";

const CREATOR_STUDIO_STORAGE_KEY = "readlead_creator_studio";
const MONETIZATION_STORAGE_KEY = "readlead_monetization_settings";
const ACTIVE_PROMO_START = "2020-01-01";
const ACTIVE_PROMO_END = "2099-12-31";
const EXPIRED_PROMO_START = "2020-01-01";
const EXPIRED_PROMO_END = "2020-01-02";
const FUTURE_PROMO_START = "2099-01-01";
const FUTURE_PROMO_END = "2099-12-31";

type CreatorWorkType = "novel" | "manga" | "audiobook";
type StoredWork = {
  id: string;
  title: string;
  promotion?: {
    discountPercent: number;
    startDate: string;
    endDate: string;
  };
};
type StoredEpisode = {
  workId: string;
  number: number;
  title: string;
  type: CreatorWorkType;
  status: "draft" | "scheduled" | "published";
  price: "free" | number;
  promotion?: {
    discountPercent: number;
    startDate: string;
    endDate: string;
  };
  releaseDate: string;
  typeSpecificData: {
    content?: string;
    wordCount?: number;
    sourceFormat?: "editor" | "txt" | "docx";
    sourceFileName?: string;
    layoutHtml?: string;
    layoutCss?: string;
    imagePages?: string[];
    audioUrl?: string;
  };
};

const mangaPageOne = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180"><rect width="120" height="180" fill="#fee2e4"/><text x="12" y="90">page-one</text></svg>`;
const mangaPageTwo = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180"><rect width="120" height="180" fill="#e5e7eb"/><text x="12" y="90">page-two</text></svg>`;
const audioOne = "mock audio file one";
const audioTwo = "mock audio file two";
const novelTxtOne = "First import opening.\n\nFirst import second paragraph.";
const novelTxtTwo = "Second import opening.\n\nSecond import second paragraph.";

function dataUrl(mimeType: string, content: string) {
  return `data:${mimeType};base64,${Buffer.from(content).toString("base64")}`;
}

async function createCreatorWork(page: Page, type: CreatorWorkType, title: string) {
  await page.goto(`/creator/works/new/${type}`);
  await page.getByPlaceholder("ตั้งชื่อเรื่อง").fill(title);
  await page
    .getByPlaceholder("เล่าให้คนอ่านรู้ว่าทำไมเรื่องนี้น่าติดตาม")
    .fill("เรื่องทดสอบสำหรับตรวจ upload ตอน");
  await Promise.all([
    page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
    page.getByRole("button", { name: "ส่งตรวจนิยาย" }).click(),
  ]);
  await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
}

async function createMinimalDocxBuffer(text: string) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );
  zip.folder("_rels")?.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );
  zip.folder("word")?.file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>${text}</w:t></w:r></w:p>
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`
  );

  return Buffer.from(await zip.generateAsync({ type: "nodebuffer" }));
}

async function openNewEpisodeForm(page: Page) {
  await Promise.all([
    page.waitForURL(/\/creator\/works\/work-.*\/episodes\/new$/, { waitUntil: "commit" }),
    page.getByRole("button", { name: "เพิ่มตอน", exact: true }).click(),
  ]);
}

async function getStoredEpisode(page: Page, title: string) {
  return page.evaluate(
    ({ key, episodeTitle }) => {
      const stored = JSON.parse(localStorage.getItem(key) ?? '{"episodes":[]}') as {
        episodes: StoredEpisode[];
      };
      return stored.episodes.find((episode) => episode.title === episodeTitle);
    },
    { key: CREATOR_STUDIO_STORAGE_KEY, episodeTitle: title }
  );
}

async function getStoredWork(page: Page, title: string) {
  return page.evaluate(
    ({ key, workTitle }) => {
      const stored = JSON.parse(localStorage.getItem(key) ?? '{"works":[]}') as {
        works: StoredWork[];
      };
      return stored.works.find((work) => work.title === workTitle);
    },
    { key: CREATOR_STUDIO_STORAGE_KEY, workTitle: title }
  );
}

async function getStoredEpisodesForWork(page: Page, title: string) {
  return page.evaluate(
    ({ key, workTitle }) => {
      const stored = JSON.parse(localStorage.getItem(key) ?? '{"works":[],"episodes":[]}') as {
        works: StoredWork[];
        episodes: StoredEpisode[];
      };
      const work = stored.works.find((item) => item.title === workTitle);
      return stored.episodes
        .filter((episode) => episode.workId === work?.id)
        .sort((left, right) => left.number - right.number);
    },
    { key: CREATOR_STUDIO_STORAGE_KEY, workTitle: title }
  );
}

test.describe("Creator Studio — creator role", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("readlead_creator_studio"));
  });

  test("creator can access /creator", async ({ page }) => {
    await page.goto("/creator");
    await expect(page.getByTestId("route-guard-authorized")).toBeVisible();
  });

  test("creator can access /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("route-guard-authorized")).toBeVisible();
  });

  test("creator cannot access /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByTestId("route-guard-denied")).toBeVisible();
  });

  test("creator sees overview by default on /creator", async ({ page }) => {
    await page.goto("/");
    await page.goto("/creator");
    await expect(page.getByText("สตูดิโอนักเขียน")).toBeVisible();
    await expect(page.getByRole("link", { name: "Overview" })).toHaveClass(/bg-primary/);
  });

  test("creator top nav item for manage novels is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar-nav-item-creator")).toBeVisible();
  });

  test("creator navbar hides browse menus and shows manage novels", async ({ page }) => {
    await page.goto("/");
    const navbar = page.getByTestId("navbar");
    await expect(page.getByTestId("navbar-nav-item-creator")).toBeVisible();
    await expect(
      navbar.getByRole("link", { name: "ห้องสมุดของฉัน", exact: true })
    ).toHaveCount(0);
    await expect(
      navbar.getByRole("button", { name: "หมวดหมู่", exact: true })
    ).toHaveCount(0);
    await expect(
      navbar.getByRole("link", { name: "นิยาย", exact: true })
    ).toHaveCount(0);
    await expect(
      navbar.getByRole("link", { name: "มังงะ", exact: true })
    ).toHaveCount(0);
    await expect(
      navbar.getByRole("link", { name: "หนังสือเสียง", exact: true })
    ).toHaveCount(0);
    await expect(page.getByPlaceholder("ค้นหาเรื่อง...")).toHaveCount(0);
  });

  test("creator can create a work and manage episodes from work detail", async ({ page }) => {
    await page.goto("/creator?tab=works");
    await expect(page.getByTestId("creator-works-panel")).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/creator\/works\/new$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "เพิ่มนิยาย" }).click(),
    ]);

    await Promise.all([
      page.waitForURL(/\/creator\/works\/new\/novel$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "ใช้ประเภทนี้" }).first().click(),
    ]);

    await page.getByPlaceholder("ตั้งชื่อเรื่อง").fill("Mock Work From Test");
    await page
      .getByPlaceholder("เล่าให้คนอ่านรู้ว่าทำไมเรื่องนี้น่าติดตาม")
      .fill("นิยายทดสอบสำหรับตรวจ flow จัดการนิยาย");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "ส่งตรวจนิยาย" }).click(),
    ]);
    await expect(
      page.getByRole("heading", { name: "Mock Work From Test", exact: true })
    ).toBeVisible();
    await expect(page.getByText("รายการตอน")).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-.*\/episodes\/new$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "เพิ่มตอน", exact: true }).click(),
    ]);

    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนเปิดเรื่อง");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);
    await expect(page.getByText("ตอนที่ 1: ตอนเปิดเรื่อง")).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-.*\/episodes\/.*\/edit$/, {
        waitUntil: "commit",
      }),
      page.getByRole("button", { name: "แก้ไขตอน" }).click(),
    ]);
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนเปิดเรื่อง ฉบับแก้ไข");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page
        .getByRole("button", { name: "บันทึกตามสถานะที่เลือก" })
        .click(),
    ]);
    await expect(page.getByText("ตอนที่ 1: ตอนเปิดเรื่อง ฉบับแก้ไข")).toBeVisible();

    await page.getByRole("button", { name: "ลบตอน" }).first().click();
    await page.getByRole("dialog").getByRole("button", { name: "ลบตอน" }).click();
    await expect(page.getByText("ตอนที่ 1: ตอนเปิดเรื่อง ฉบับแก้ไข")).toHaveCount(0);
  });

  test("creator can edit novel content from the episode list without changing metadata", async ({ page }) => {
    await createCreatorWork(page, "novel", "Content Edit Work");
    await openNewEpisodeForm(page);

    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนเนื้อหาหลัก");
    await page.getByTestId("episode-price-mode").selectOption("paid");
    await page.getByTestId("episode-coin-price").fill("4");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const beforeEdit = await getStoredEpisode(page, "ตอนเนื้อหาหลัก");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-.*\/episodes\/.*\/content$/, {
        waitUntil: "commit",
      }),
      page
        .getByRole("row", { name: /ตอนที่ 1: ตอนเนื้อหาหลัก/ })
        .getByRole("button", { name: "แก้ไขเนื้อหา" })
        .click(),
    ]);

    await expect(page.getByRole("heading", { name: /แก้ไขเนื้อหา/ })).toBeVisible();
    const editor = page.locator(".ProseMirror").first();
    await editor.fill("Updated content from content-only page");

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกเนื้อหา" }).click(),
    ]);

    const afterEdit = await getStoredEpisode(page, "ตอนเนื้อหาหลัก");
    expect(afterEdit?.typeSpecificData.content).toContain(
      "Updated content from content-only page"
    );
    expect(afterEdit?.title).toBe(beforeEdit?.title);
    expect(afterEdit?.status).toBe(beforeEdit?.status);
    expect(afterEdit?.price).toBe(beforeEdit?.price);
    expect(afterEdit?.releaseDate).toBe(beforeEdit?.releaseDate);
  });

  test("creator can upload multiple manga pages and persist reordered pages", async ({ page }) => {
    const firstPageDataUrl = dataUrl("image/svg+xml", mangaPageOne);
    const secondPageDataUrl = dataUrl("image/svg+xml", mangaPageTwo);

    await createCreatorWork(page, "manga", "Manga Upload Work");
    await openNewEpisodeForm(page);

    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนภาพอัปโหลด");
    await page.getByLabel("อัปโหลดไฟล์ภาพหลายหน้า").setInputFiles([
      {
        name: "page-one.svg",
        mimeType: "image/svg+xml",
        buffer: Buffer.from(mangaPageOne),
      },
      {
        name: "page-two.svg",
        mimeType: "image/svg+xml",
        buffer: Buffer.from(mangaPageTwo),
      },
    ]);

    await expect(page.getByTestId("manga-image-page")).toHaveCount(2);
    await expect(page.getByAltText("ตัวอย่างหน้า 1")).toBeVisible();
    await expect(page.getByAltText("ตัวอย่างหน้า 2")).toBeVisible();

    await page.getByRole("button", { name: "ย้ายหน้า 2 ขึ้น" }).click();
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const savedEpisode = await getStoredEpisode(page, "ตอนภาพอัปโหลด");
    expect(savedEpisode?.typeSpecificData.imagePages).toEqual([
      secondPageDataUrl,
      firstPageDataUrl,
    ]);

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-.*\/episodes\/.*\/edit$/, {
        waitUntil: "commit",
      }),
      page.getByRole("button", { name: "แก้ไขตอน" }).click(),
    ]);

    const pageUrlInputs = page.getByPlaceholder("ใส่ URL ภาพ mock ของหน้านี้");
    await expect(pageUrlInputs.first()).toHaveValue(secondPageDataUrl);
    await expect(pageUrlInputs.nth(1)).toHaveValue(firstPageDataUrl);
  });

  test("creator can add narrative, image, and audio episodes under one work", async ({ page }) => {
    await createCreatorWork(page, "novel", "Mixed Episode Work");
    await openNewEpisodeForm(page);

    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนบรรยาย");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    await openNewEpisodeForm(page);
    await page.getByRole("button", { name: "ภาพ", exact: true }).click();
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนภาพ");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    await openNewEpisodeForm(page);
    await page.getByRole("button", { name: "นิยายเสียง", exact: true }).click();
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนเสียง");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const episodes = await getStoredEpisodesForWork(page, "Mixed Episode Work");
    expect(episodes.map((episode) => [episode.title, episode.type])).toEqual([
      ["ตอนบรรยาย", "novel"],
      ["ตอนภาพ", "manga"],
      ["ตอนเสียง", "audiobook"],
    ]);

    await expect(
      page
        .getByRole("row", { name: /ตอนที่ 1: ตอนบรรยาย/ })
        .getByRole("button", { name: "แก้ไขเนื้อหา" })
    ).toHaveCount(1);
    await expect(
      page
        .getByRole("row", { name: /ตอนที่ 2: ตอนภาพ/ })
        .getByRole("button", { name: "แก้ไขเนื้อหา" })
    ).toHaveCount(0);
    await expect(
      page
        .getByRole("row", { name: /ตอนที่ 3: ตอนเสียง/ })
        .getByRole("button", { name: "แก้ไขเนื้อหา" })
    ).toHaveCount(0);
  });

  test("creator can import multiple novel TXT files and edit imported content", async ({ page }) => {
    await createCreatorWork(page, "novel", "Novel TXT Import Work");
    await openNewEpisodeForm(page);

    await page.getByLabel("อัปโหลด TXT / DOCX").setInputFiles([
      {
        name: "chapter-one.txt",
        mimeType: "text/plain",
        buffer: Buffer.from(novelTxtOne),
      },
      {
        name: "chapter-two.txt",
        mimeType: "text/plain",
        buffer: Buffer.from(novelTxtTwo),
      },
    ]);

    await expect(page.getByTestId("novel-import-draft")).toHaveCount(2);
    await expect(page.getByText("ตอนที่ 1: chapter-one")).toBeVisible();
    await expect(page.getByText("ตอนที่ 2: chapter-two")).toBeVisible();

    await page.getByRole("button", { name: "ย้ายตอน chapter-two ขึ้น" }).click();
    await expect(page.getByText("ตอนที่ 1: chapter-two")).toBeVisible();

    await page.getByRole("button", { name: /ตอนที่ 1: chapter-two/ }).click();
    const editor = page.locator(".ProseMirror").first();
    await expect(editor).toContainText("Second import opening.");
    await editor.fill("Edited second content from batch");

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    await expect(page.getByText("ตอนที่ 1: chapter-two")).toBeVisible();
    await expect(page.getByText("ตอนที่ 2: chapter-one")).toBeVisible();

    const importedEpisodes = await getStoredEpisodesForWork(page, "Novel TXT Import Work");
    expect(importedEpisodes).toHaveLength(2);
    expect(importedEpisodes.map((episode) => [episode.number, episode.title])).toEqual([
      [1, "chapter-two"],
      [2, "chapter-one"],
    ]);
    expect(importedEpisodes[0].typeSpecificData.content).toContain(
      "Edited second content from batch"
    );
    expect(importedEpisodes[1].typeSpecificData.content).toContain(
      "<p>First import opening.</p><p>First import second paragraph.</p>"
    );

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-.*\/episodes\/.*\/content$/, {
        waitUntil: "commit",
      }),
      page
        .getByRole("row", { name: /ตอนที่ 1: chapter-two/ })
        .getByRole("button", { name: "แก้ไขเนื้อหา" })
        .click(),
    ]);

    const editEditor = page.locator(".ProseMirror").first();
    await expect(editEditor).toContainText("Edited second content from batch");
    await editEditor.fill("Edited again in single episode editor");

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกเนื้อหา" }).click(),
    ]);

    const editedEpisodes = await getStoredEpisodesForWork(page, "Novel TXT Import Work");
    expect(editedEpisodes[0].typeSpecificData.content).toContain(
      "Edited again in single episode editor"
    );
  });

  test("creator can import DOCX and see the persisted layout preview on edit", async ({ page }) => {
    const docxBuffer = await createMinimalDocxBuffer("DOCX layout paragraph");

    await createCreatorWork(page, "novel", "Novel DOCX Import Work");
    await openNewEpisodeForm(page);

    await page.getByLabel("อัปโหลด TXT / DOCX").setInputFiles({
      name: "layout-chapter.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      buffer: docxBuffer,
    });

    await expect(page.getByTestId("novel-import-draft")).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: /layout-chapter\.docx/ })
    ).toBeVisible();
    await expect(page.getByText("ตัวอย่าง DOCX แบบรักษาหน้ากระดาษ")).toBeVisible();
    await expect(page.getByText("DOCX layout paragraph")).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const savedEpisode = await getStoredEpisode(page, "layout-chapter");
    expect(savedEpisode?.typeSpecificData.sourceFormat).toBe("docx");
    expect(savedEpisode?.typeSpecificData.sourceFileName).toBe("layout-chapter.docx");
    expect(savedEpisode?.typeSpecificData.layoutHtml).toContain("DOCX layout paragraph");

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-.*\/episodes\/.*\/content$/, {
        waitUntil: "commit",
      }),
      page.getByRole("button", { name: "แก้ไขเนื้อหา" }).click(),
    ]);

    await expect(page.getByText("ตัวอย่าง DOCX แบบรักษาหน้ากระดาษ")).toBeVisible();
    await expect(page.getByText("DOCX layout paragraph")).toBeVisible();
  });

  test("creator episode price follows the admin min and max policy", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          coinOffers: [],
          episodePricePolicy: {
            minCoins: 2,
            maxCoins: 4,
            recommendedCoins: 4,
          },
          ads: [],
        })
      );
    }, MONETIZATION_STORAGE_KEY);

    await createCreatorWork(page, "novel", "Policy Price Work");
    await openNewEpisodeForm(page);

    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนราคา");
    await page.getByTestId("episode-price-mode").selectOption("paid");
    await expect(page.getByTestId("episode-coin-price")).toHaveValue("4");

    await page.getByTestId("episode-coin-price").fill("9");
    await page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click();
    await expect(page.getByText("ราคาต่อตอนต้องอยู่ระหว่าง 2-4 coins")).toBeVisible();

    await page.getByTestId("episode-coin-price").fill("4");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const savedEpisode = await getStoredEpisode(page, "ตอนราคา");
    expect(savedEpisode?.price).toBe(4);
    expect(savedEpisode?.typeSpecificData.sourceFormat).toBe("editor");
  });

  test("creator can set work promotion and override it with episode promotion", async ({ page }) => {
    await page.goto("/creator/works/new/novel");
    await page.getByPlaceholder("ตั้งชื่อเรื่อง").fill("Promotion Work");
    await page
      .getByPlaceholder("เล่าให้คนอ่านรู้ว่าทำไมเรื่องนี้น่าติดตาม")
      .fill("เรื่องทดสอบโปรโมชัน");
    await page.getByTestId("work-promotion-toggle").check();
    await page.getByTestId("work-promotion-discount").fill("20");
    await page.getByTestId("work-promotion-start").fill(ACTIVE_PROMO_START);
    await page.getByTestId("work-promotion-end").fill(ACTIVE_PROMO_END);

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "ส่งตรวจนิยาย" }).click(),
    ]);

    const storedWork = await getStoredWork(page, "Promotion Work");
    expect(storedWork?.promotion).toEqual({
      discountPercent: 20,
      startDate: ACTIVE_PROMO_START,
      endDate: ACTIVE_PROMO_END,
    });

    await openNewEpisodeForm(page);
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนโปรทั้งเรื่อง");
    await page.getByTestId("episode-price-mode").selectOption("paid");
    await page.getByTestId("episode-coin-price").fill("10");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    await openNewEpisodeForm(page);
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนโปรรายตอน");
    await page.getByTestId("episode-price-mode").selectOption("paid");
    await page.getByTestId("episode-coin-price").fill("10");
    await page.getByTestId("episode-promotion-toggle").check();
    await page.getByTestId("episode-promotion-discount").fill("50");
    await page.getByTestId("episode-promotion-start").fill(ACTIVE_PROMO_START);
    await page.getByTestId("episode-promotion-end").fill(ACTIVE_PROMO_END);
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const workPromoRow = page.getByRole("row", { name: /ตอนโปรทั้งเรื่อง/ });
    await expect(workPromoRow).toContainText("10 coins");
    await expect(workPromoRow).toContainText("8 coins");
    await expect(workPromoRow).toContainText("ลด 20%");
    await expect(workPromoRow).toContainText("โปรทั้งเรื่อง");

    const episodePromoRow = page.getByRole("row", { name: /ตอนโปรรายตอน/ });
    await expect(episodePromoRow).toContainText("10 coins");
    await expect(episodePromoRow).toContainText("5 coins");
    await expect(episodePromoRow).toContainText("ลด 50%");
    await expect(episodePromoRow).toContainText("โปรรายตอน");

    const savedEpisode = await getStoredEpisode(page, "ตอนโปรรายตอน");
    expect(savedEpisode?.promotion).toEqual({
      discountPercent: 50,
      startDate: ACTIVE_PROMO_START,
      endDate: ACTIVE_PROMO_END,
    });
  });

  test("inactive promotions do not discount and free episodes do not store promotion", async ({ page }) => {
    await page.goto("/creator/works/new/novel");
    await page.getByPlaceholder("ตั้งชื่อเรื่อง").fill("Inactive Promotion Work");
    await page
      .getByPlaceholder("เล่าให้คนอ่านรู้ว่าทำไมเรื่องนี้น่าติดตาม")
      .fill("เรื่องทดสอบโปรหมดอายุ");
    await page.getByTestId("work-promotion-toggle").check();
    await page.getByTestId("work-promotion-discount").fill("50");
    await page.getByTestId("work-promotion-start").fill(EXPIRED_PROMO_START);
    await page.getByTestId("work-promotion-end").fill(EXPIRED_PROMO_END);
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "ส่งตรวจนิยาย" }).click(),
    ]);

    await openNewEpisodeForm(page);
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนโปรหมดอายุ");
    await page.getByTestId("episode-price-mode").selectOption("paid");
    await page.getByTestId("episode-coin-price").fill("10");
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    await openNewEpisodeForm(page);
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนโปรอนาคต");
    await page.getByTestId("episode-price-mode").selectOption("paid");
    await page.getByTestId("episode-coin-price").fill("10");
    await page.getByTestId("episode-promotion-toggle").check();
    await page.getByTestId("episode-promotion-discount").fill("50");
    await page.getByTestId("episode-promotion-start").fill(FUTURE_PROMO_START);
    await page.getByTestId("episode-promotion-end").fill(FUTURE_PROMO_END);
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    await openNewEpisodeForm(page);
    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนฟรีไม่มีโปร");
    await expect(page.getByTestId("episode-promotion-toggle")).toBeDisabled();
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const expiredRow = page.getByRole("row", { name: /ตอนโปรหมดอายุ/ });
    await expect(expiredRow).toContainText("10 coins");
    await expect(expiredRow).not.toContainText("ลด 50%");

    const futureRow = page.getByRole("row", { name: /ตอนโปรอนาคต/ });
    await expect(futureRow).toContainText("10 coins");
    await expect(futureRow).not.toContainText("ลด 50%");

    const freeEpisode = await getStoredEpisode(page, "ตอนฟรีไม่มีโปร");
    expect(freeEpisode?.price).toBe("free");
    expect(freeEpisode?.promotion).toBeUndefined();
  });

  test("batch imported novel episodes keep the episode promotion", async ({ page }) => {
    await createCreatorWork(page, "novel", "Batch Promotion Work");
    await openNewEpisodeForm(page);

    await page.getByTestId("episode-price-mode").selectOption("paid");
    await page.getByTestId("episode-coin-price").fill("10");
    await page.getByTestId("episode-promotion-toggle").check();
    await page.getByTestId("episode-promotion-discount").fill("50");
    await page.getByTestId("episode-promotion-start").fill(ACTIVE_PROMO_START);
    await page.getByTestId("episode-promotion-end").fill(ACTIVE_PROMO_END);
    await page.getByLabel("อัปโหลด TXT / DOCX").setInputFiles([
      {
        name: "promo-one.txt",
        mimeType: "text/plain",
        buffer: Buffer.from(novelTxtOne),
      },
      {
        name: "promo-two.txt",
        mimeType: "text/plain",
        buffer: Buffer.from(novelTxtTwo),
      },
    ]);

    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const importedEpisodes = await getStoredEpisodesForWork(page, "Batch Promotion Work");
    expect(importedEpisodes).toHaveLength(2);
    expect(importedEpisodes.every((episode) => episode.price === 10)).toBe(true);
    expect(importedEpisodes.every((episode) => episode.promotion?.discountPercent === 50)).toBe(true);
  });

  test("detail purchase modal and reader unlock use discounted price", async ({ page }) => {
    await page.addInitScript(
      ({ key, startDate, endDate }) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            works: [
              {
                id: "work-obsidian-chronicles",
                title: "The Obsidian Chronicles",
                type: "novel",
                status: "published",
                synopsis: "",
                cover: "",
                tags: [],
                reads: "0",
                revenue: 0,
                updatedAt: "test",
              },
            ],
            episodes: [
              {
                id: "ep-obsidian-2",
                workId: "work-obsidian-chronicles",
                type: "novel",
                number: 2,
                title: "Discounted Reader Chapter",
                status: "published",
                price: 10,
                promotion: {
                  discountPercent: 50,
                  startDate,
                  endDate,
                },
                releaseDate: "2026-01-22",
                updatedAt: "test",
                typeSpecificData: {
                  content: "",
                  wordCount: 0,
                },
              },
            ],
          })
        );
      },
      {
        key: CREATOR_STUDIO_STORAGE_KEY,
        startDate: ACTIVE_PROMO_START,
        endDate: ACTIVE_PROMO_END,
      }
    );

    await page.goto("/detail");
    await expect(page.getByText("Discounted Reader Chapter")).toBeVisible();
    await expect(page.getByText("ลด 50%")).toBeVisible();
    await page.getByRole("button", { name: /ปลดล็อก/ }).first().click();
    await expect(page.getByText("445 coins")).toBeVisible();

    await page.evaluate(() => {
      localStorage.setItem("readlead_coins", "10");
      localStorage.setItem("readlead_unlocked_chapters", "[]");
    });
    await page.goto("/reader");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByText("ใช้ 5 เหรียญ")).toBeVisible();
    const remainingCoins = await page.evaluate(() => localStorage.getItem("readlead_coins"));
    expect(remainingCoins).toBe("5");
  });

  test("creator can upload one audiobook file and replace it", async ({ page }) => {
    const firstAudioDataUrl = dataUrl("audio/mpeg", audioOne);
    const secondAudioDataUrl = dataUrl("audio/mpeg", audioTwo);

    await createCreatorWork(page, "audiobook", "Audio Upload Work");
    await openNewEpisodeForm(page);

    await page.getByPlaceholder("ตั้งชื่อตอน").fill("ตอนเสียงอัปโหลด");
    await page.getByLabel("อัปโหลดไฟล์เสียง 1 ไฟล์").setInputFiles({
      name: "first.mp3",
      mimeType: "audio/mpeg",
      buffer: Buffer.from(audioOne),
    });

    await expect(page.getByTestId("audiobook-audio-preview")).toHaveCount(1);
    await expect(page.getByPlaceholder("https://...")).toHaveValue(firstAudioDataUrl);

    await page.getByLabel("อัปโหลดไฟล์เสียง 1 ไฟล์").setInputFiles({
      name: "second.mp3",
      mimeType: "audio/mpeg",
      buffer: Buffer.from(audioTwo),
    });

    await expect(page.getByTestId("audiobook-audio-preview")).toHaveCount(1);
    await expect(page.getByPlaceholder("https://...")).toHaveValue(secondAudioDataUrl);
    await Promise.all([
      page.waitForURL(/\/creator\/works\/work-[^/]+$/, { waitUntil: "commit" }),
      page.getByRole("button", { name: "บันทึกและเผยแพร่" }).click(),
    ]);

    const savedEpisode = await getStoredEpisode(page, "ตอนเสียงอัปโหลด");
    expect(savedEpisode?.typeSpecificData.audioUrl).toBe(secondAudioDataUrl);
  });
});

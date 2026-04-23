import { expect, test } from "@playwright/test";

const COMMENT_STORAGE_KEY = "readlead_reader_line_comments";

test.describe("Reader line comments", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), COMMENT_STORAGE_KEY);
  });

  test("lets readers comment on a source line and persists after refresh", async ({
    page,
  }) => {
    await page.goto("/reader");

    const firstLine = page.getByTestId("reader-line-0");
    await expect(firstLine).toBeVisible();
    await firstLine.click();

    const panel = page.getByTestId("reader-line-comment-panel");
    await expect(panel).toBeVisible();

    const box = await panel.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.x).toBeGreaterThan((viewport?.width ?? 0) / 2);

    await page
      .getByTestId("reader-line-comment-input")
      .fill("This line sets the mood.");
    await page.getByTestId("reader-line-comment-submit").click();

    await expect(page.getByText("This line sets the mood.")).toBeVisible();
    await expect(page.getByTestId("reader-line-0-comment-count")).toContainText(
      "1"
    );

    await page.getByTestId("reader-comments-toggle").click();
    await expect(panel).toHaveCount(0);
    await expect(page.getByTestId("reader-line-0-comment-count")).toHaveCount(0);
    await firstLine.click();
    await expect(page.getByTestId("reader-line-comment-panel")).toHaveCount(0);

    await page.getByTestId("reader-comments-toggle").click();
    await firstLine.click();
    await expect(page.getByTestId("reader-line-comment-panel")).toBeVisible();

    await page.reload();
    await page.getByTestId("reader-line-0").click();

    await expect(page.getByText("This line sets the mood.")).toBeVisible();
    await expect(page.getByTestId("reader-line-comment-count")).toContainText(
      "1 คอมเมนต์"
    );

    await page.getByTestId("reader-theme-toggle").click();
    await expect(panel).toBeVisible();
    await expect(page.getByText("This line sets the mood.")).toBeVisible();
  });
});

test.describe("Reader line comments on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), COMMENT_STORAGE_KEY);
  });

  test("opens the comment panel as a bottom sheet", async ({ page }) => {
    await page.goto("/reader");
    await page.getByTestId("reader-line-0").click();

    const panel = page.getByTestId("reader-line-comment-panel");
    await expect(panel).toBeVisible();

    const box = await panel.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.y).toBeGreaterThan((viewport?.height ?? 0) / 3);
    expect(box?.width).toBeGreaterThan((viewport?.width ?? 0) - 8);
  });
});

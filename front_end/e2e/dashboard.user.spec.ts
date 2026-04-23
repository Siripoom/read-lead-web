import { test, expect } from "@playwright/test";

const VIP_STATE_STORAGE_KEY = "readlead_vip_state";

test.describe("Dashboard — user role", () => {
  test("user can access /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("route-guard-denied")).not.toBeVisible();
    await expect(page.getByTestId("route-guard-authorized")).toBeVisible();
    await expect(page.getByText("My Dashboard")).toBeVisible();
  });

  test("user cannot access /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByTestId("route-guard-denied")).toBeVisible();
  });

  test("user cannot access /creator", async ({ page }) => {
    await page.goto("/creator");
    await expect(page.getByTestId("route-guard-denied")).toBeVisible();
  });

  test("navbar shows user info, not login/signup", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar-user-info")).toBeVisible();
    await expect(page.getByTestId("navbar-login-link")).not.toBeVisible();
    await expect(page.getByTestId("navbar-signup-link")).not.toBeVisible();
  });

  test("sidebar is hidden for user layout", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("sidebar")).toHaveCount(0);
  });

  test("navbar role label shows user", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar-user-info")).toContainText("สมาชิก");
  });

  test("My Library top nav item is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar-nav-item-dashboard")).toBeVisible();
  });

  test("reader can vote with tickets and donate from the story detail page", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          totalTopUpCoins: 600,
          dailyTicketDate: new Date().toISOString().slice(0, 10),
          dailyTickets: 1,
          monthlyTickets: 2,
          votesByStory: {},
          donationsByStory: {},
        })
      );
    }, VIP_STATE_STORAGE_KEY);

    await page.goto("/detail");
    await expect(page.getByText(/รายวัน 1/)).toBeVisible();
    await expect(page.getByText(/รายเดือน 2/)).toBeVisible();

    await page.getByRole("button", { name: "โหวตด้วยตั๋วรายวัน" }).click();
    await expect(page.getByText(/รายวัน 0/)).toBeVisible();
    await expect(page.getByText(/โหวตเรื่องนี้แล้ว 1 ครั้ง/)).toBeVisible();

    await page.getByRole("button", { name: "โหวตด้วยตั๋วรายเดือน" }).click();
    await expect(page.getByText(/รายเดือน 1/)).toBeVisible();
    await expect(page.getByText(/โหวตเรื่องนี้แล้ว 2 ครั้ง/)).toBeVisible();

    await page.getByRole("button", { name: "Donate" }).click();
    await page.getByPlaceholder("กำหนดเอง").fill("5");
    await page.getByRole("button", { name: "โดเนท 5 coins" }).click();
    await expect(page.getByText("ส่งโดเนทแล้ว")).toBeVisible();
    await expect(page.getByText(/โดเนทแล้ว 5 coins/)).toBeVisible();
  });
});

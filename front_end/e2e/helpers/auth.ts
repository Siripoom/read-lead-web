import { Page } from "@playwright/test";

type Role = "guest" | "user" | "creator" | "admin";

export async function setRole(page: Page, role: Role) {
  await page.evaluate((r) => localStorage.setItem("readlead_role", r), role);
  await page.reload();
}

export async function clearRole(page: Page) {
  await page.evaluate(() => localStorage.removeItem("readlead_role"));
  await page.reload();
}

import { test, expect } from "@playwright/test";

const PROTECTED_ROUTES = ["/dashboard", "/creator", "/admin", "/finance"];

test.describe("Protected routes — guest sees access denied", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} shows access denied for guest`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByTestId("route-guard-denied")).toBeVisible();
      await expect(page.getByText("Access Denied")).toBeVisible();
    });

    test(`${route} Go Home link navigates to /`, async ({ page }) => {
      await page.goto(route);
      await page.getByTestId("route-guard-go-home").click();
      await expect(page).toHaveURL("/");
    });
  }
});

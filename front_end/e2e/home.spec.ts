import { test, expect } from "@playwright/test";

test.describe("Home page (guest)", () => {
  test("renders sidebar and navbar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar")).toBeVisible();
  });

  test("navbar shows Login and Sign Up for guest", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar-login-link")).toBeVisible();
    await expect(page.getByTestId("navbar-signup-link")).toBeVisible();
    await expect(page.getByTestId("navbar-user-info")).not.toBeVisible();
    await expect(page.getByPlaceholder("ค้นหาเรื่อง...")).toHaveCount(0);
  });

  test("guest navbar shows only home and discover nav items", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navbar-nav-item-home")).toBeVisible();
    await expect(page.getByTestId("navbar-nav-item-discover")).toBeVisible();
    await expect(page.getByTestId("navbar-nav-item-dashboard")).toHaveCount(0);
    await expect(page.getByTestId("navbar-nav-item-creator")).toHaveCount(0);
  });

  test("navbar login link navigates to /login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("navbar-login-link").click();
    await expect(page).toHaveURL("/login");
  });

  test("navbar sign up link navigates to /register", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("navbar-signup-link").click();
    await expect(page).toHaveURL("/register");
  });
});

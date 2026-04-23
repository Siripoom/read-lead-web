import { test, expect } from "@playwright/test";

test.describe("Sidebar navigation (guest)", () => {
  test("guest sidebar has exactly 2 nav items", async ({ page }) => {
    await page.goto("/");
    const navItems = page.getByTestId("sidebar-nav").getByRole("link");
    await expect(navItems).toHaveCount(2);
  });

  test("clicking Discover nav item navigates to /discover", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("sidebar-nav-item-discover").click();
    await expect(page).toHaveURL("/discover");
  });

  test("Home nav item is active on /", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("sidebar-nav-item-home")).toHaveClass(/bg-primary-light/);
  });

  test("Discover nav item is active on /discover", async ({ page }) => {
    await page.goto("/discover");
    await expect(page.getByTestId("sidebar-nav-item-discover")).toHaveClass(/bg-primary-light/);
  });
});

test.describe("Navbar links (guest)", () => {
  test("login link navigates to /login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("navbar-login-link").click();
    await expect(page).toHaveURL("/login");
  });

  test("sign up link navigates to /register", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("navbar-signup-link").click();
    await expect(page).toHaveURL("/register");
  });
});

import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test("renders all form elements", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("login-form")).toBeVisible();
    await expect(page.getByTestId("login-email")).toBeVisible();
    await expect(page.getByTestId("login-password")).toBeVisible();
    await expect(page.getByTestId("login-password-toggle")).toBeVisible();
    await expect(page.getByTestId("login-submit")).toBeVisible();
  });

  test("password toggle switches input type", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.getByTestId("login-password");
    await expect(passwordInput).toHaveAttribute("type", "password");
    await page.getByTestId("login-password-toggle").click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await page.getByTestId("login-password-toggle").click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("submit button is disabled while loading", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("test@example.com");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("login-submit")).toBeDisabled();
  });

  test("successful login sets role and redirects to /", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("test@example.com");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();
    await page.waitForURL("/", { timeout: 5000 });
    const role = await page.evaluate(() => localStorage.getItem("readlead_role"));
    expect(role).toBe("user");
  });

  test("Create an account link navigates to /register", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Create an account" }).click();
    await expect(page).toHaveURL("/register");
  });
});

test.describe("Register", () => {
  test("renders all form elements", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByTestId("register-form")).toBeVisible();
    await expect(page.getByTestId("register-name")).toBeVisible();
    await expect(page.getByTestId("register-email")).toBeVisible();
    await expect(page.getByTestId("register-password")).toBeVisible();
    await expect(page.getByTestId("register-confirm")).toBeVisible();
    await expect(page.getByTestId("register-terms")).toBeVisible();
    await expect(page.getByTestId("register-submit")).toBeVisible();
  });

  test("submit button is disabled without terms agreement", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("register-name").fill("Arthur Reader");
    await page.getByTestId("register-email").fill("arthur@example.com");
    await page.getByTestId("register-password").fill("password123");
    await page.getByTestId("register-confirm").fill("password123");
    await expect(page.getByTestId("register-submit")).toBeDisabled();
  });

  test("checking terms enables submit button", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("register-terms").check();
    await expect(page.getByTestId("register-submit")).toBeEnabled();
  });

  test("successful registration redirects to / and sets role", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("register-name").fill("Arthur Reader");
    await page.getByTestId("register-email").fill("arthur@example.com");
    await page.getByTestId("register-password").fill("password123");
    await page.getByTestId("register-confirm").fill("password123");
    await page.getByTestId("register-terms").check();
    await page.getByTestId("register-submit").click();
    await page.waitForURL("/", { timeout: 5000 });
    const role = await page.evaluate(() => localStorage.getItem("readlead_role"));
    expect(role).toBe("user");
  });

  test("Log In link navigates to /login", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: "Log In" }).click();
    await expect(page).toHaveURL("/login");
  });
});

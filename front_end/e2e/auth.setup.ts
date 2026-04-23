import { test as setup } from "@playwright/test";
import path from "path";

const AUTH_DIR = path.join(__dirname, ".auth");

setup("create user auth state", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("readlead_role", "user");
  });
  await page.context().storageState({ path: path.join(AUTH_DIR, "user.json") });
});

setup("create creator auth state", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("readlead_role", "creator");
  });
  await page.context().storageState({ path: path.join(AUTH_DIR, "creator.json") });
});

setup("create admin auth state", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("readlead_role", "admin");
  });
  await page.context().storageState({ path: path.join(AUTH_DIR, "admin.json") });
});

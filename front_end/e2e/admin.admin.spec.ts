import { test, expect } from "@playwright/test";

test.describe("Admin Panel — admin role", () => {
  test("admin can access /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByTestId("route-guard-authorized")).toBeVisible();
  });

  test("admin can access /creator", async ({ page }) => {
    await page.goto("/creator");
    await expect(page.getByTestId("route-guard-authorized")).toBeVisible();
  });

  test("admin can access /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("route-guard-authorized")).toBeVisible();
  });

  test("admin can access /finance", async ({ page }) => {
    await page.goto("/finance");
    await expect(page.getByTestId("route-guard-authorized")).toBeVisible();
  });

  test("sidebar shows only admin nav items for admin", async ({ page }) => {
    await page.goto("/");
    const navItems = page.getByTestId("sidebar-nav").getByRole("link");
    await expect(navItems).toHaveCount(2);
    await expect(page.getByTestId("sidebar-nav-item-admin")).toBeVisible();
    await expect(page.getByTestId("sidebar-nav-item-finance")).toBeVisible();
    await expect(page.getByTestId("sidebar-nav-item-home")).toHaveCount(0);
    await expect(page.getByTestId("sidebar-nav-item-discover")).toHaveCount(0);
    await expect(page.getByTestId("sidebar-nav-item-dashboard")).toHaveCount(0);
    await expect(page.getByTestId("sidebar-nav-item-creator")).toHaveCount(0);
  });

  test("sidebar role badge shows admin", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("sidebar-role-badge")).toHaveText("admin");
  });

  test("Finance nav item is visible for admin", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("sidebar-nav-item-finance")).toBeVisible();
  });

  test("admin navbar hides reader and creator menus", async ({ page }) => {
    await page.goto("/");
    const navbar = page.getByTestId("navbar");
    await expect(page.getByTestId("navbar-nav-item-home")).toHaveCount(0);
    await expect(page.getByTestId("navbar-nav-item-discover")).toHaveCount(0);
    await expect(page.getByTestId("navbar-nav-item-dashboard")).toHaveCount(0);
    await expect(page.getByTestId("navbar-nav-item-creator")).toHaveCount(0);
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

  test("admin can manage coin offers and the top-up modal reflects active offers", async ({ page }) => {
    await page.goto("/admin");
    await page.getByRole("button", { name: "Monetization" }).click();

    await page.getByPlaceholder("ชื่อโปรโมชัน").fill("Admin Promo");
    await page.getByLabel("จำนวนเหรียญ").fill("777");
    await page.getByLabel("ราคาโปรโมชัน").fill("66");
    await page.getByPlaceholder("ป้าย เช่น Best Value").fill("Admin Deal");
    await page.getByRole("button", { name: "เพิ่มโปร" }).click();

    await expect(page.getByRole("row", { name: /Admin Promo/ })).toBeVisible();
    await page.getByRole("row", { name: /Admin Promo/ }).getByRole("button", { name: "แก้ไข" }).click();
    await page.getByPlaceholder("ชื่อโปรโมชัน").fill("Admin Promo Updated");
    await page.getByRole("button", { name: "บันทึก", exact: true }).click();
    await expect(page.getByRole("row", { name: /Admin Promo Updated/ })).toBeVisible();

    await page.goto("/dashboard");
    await page.getByRole("button", { name: /Top Up/ }).click();
    await expect(page.getByText("777")).toBeVisible();
    await expect(page.getByText("Admin Deal")).toBeVisible();

    await page.goto("/admin");
    await page.getByRole("button", { name: "Monetization" }).click();
    await page
      .getByRole("row", { name: /Admin Promo Updated/ })
      .getByRole("button", { name: "ลบ" })
      .click();
    await expect(page.getByRole("row", { name: /Admin Promo Updated/ })).toHaveCount(0);

    await page.getByPlaceholder("ชื่อระดับ เช่น Gold Reader").fill("VIP Tester");
    await page.getByPlaceholder("ฉายา เช่น ผู้อุปถัมภ์นิยาย").fill("นักอ่านทดสอบ");
    await page.getByLabel("ระดับ VIP").fill("9");
    await page.getByLabel("ยอดเติมขั้นต่ำ").fill("777");
    await page.getByLabel("ตั๋วรายเดือน").fill("12");
    await page.getByRole("button", { name: "เพิ่ม VIP" }).click();
    await expect(page.getByRole("row", { name: /VIP Tester/ })).toBeVisible();

    await page.getByRole("row", { name: /VIP Tester/ }).getByRole("button", { name: "แก้ไข" }).click();
    await page.getByPlaceholder("ชื่อระดับ เช่น Gold Reader").fill("VIP Tester Updated");
    await page.getByRole("button", { name: "บันทึก VIP" }).click();
    await expect(page.getByRole("row", { name: /VIP Tester Updated/ })).toBeVisible();

    await page
      .getByRole("row", { name: /VIP Tester Updated/ })
      .getByRole("button", { name: "ลบ" })
      .click();
    await expect(page.getByRole("row", { name: /VIP Tester Updated/ })).toHaveCount(0);
  });

  test("admin can manage ads and active placements render", async ({ page }) => {
    await page.goto("/admin");
    await page.getByRole("button", { name: "Ads" }).click();

    await page.getByPlaceholder("หัวข้อโฆษณา").fill("Reader Test Ad");
    await page.getByPlaceholder("รายละเอียดโฆษณา").fill("Visible in reader placement");
    await page.getByPlaceholder("CTA").fill("เติมเลย");
    await page.getByRole("combobox").selectOption("reader");
    await page.getByRole("button", { name: "เพิ่มโฆษณา" }).click();

    await expect(page.getByRole("row", { name: /Reader Test Ad/ })).toBeVisible();
    await page.getByRole("row", { name: /Reader Test Ad/ }).getByRole("button", { name: "แก้ไข" }).click();
    await page.getByPlaceholder("หัวข้อโฆษณา").fill("Reader Test Ad Updated");
    await page.getByRole("button", { name: "บันทึก", exact: true }).click();
    await expect(page.getByRole("row", { name: /Reader Test Ad Updated/ })).toBeVisible();

    await page.goto("/reader");
    await expect(page.getByTestId("ad-placement-reader")).toContainText(
      "Reader Test Ad Updated"
    );

    await page.goto("/");
    await expect(page.getByTestId("ad-placement-home_discover")).toBeVisible();

    await page.goto("/admin");
    await page.getByRole("button", { name: "Ads" }).click();
    await page
      .getByRole("row", { name: /Reader Test Ad Updated/ })
      .getByRole("button", { name: "ลบ" })
      .click();
    await expect(page.getByRole("row", { name: /Reader Test Ad Updated/ })).toHaveCount(0);
  });
});

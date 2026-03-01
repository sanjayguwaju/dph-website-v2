import { test, expect, Page } from "@playwright/test";

test.describe("Frontend", () => {
  let page: Page;

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext();
    page = await context.newPage();
  });

  test("can go on homepage", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Expect the title to contain "Hospital" or whatever is in site settings (defaults to Amppipal Hospital)
    // We'll use a regex that matches the default or typical hospital name
    await expect(page).toHaveTitle(/Hospital/);

    // Check for the presence of the header title or a key section
    // The header has a h1 with the hospital name
    const heading = page.locator("h1.header-hospital-title");
    await expect(heading).toBeVisible();

    // Check for a section like "Gallery" or "News"
    const gallerySection = page.locator("h2.gallery-optimized-title");
    await expect(gallerySection).toContainText("Gallery");
  });
});

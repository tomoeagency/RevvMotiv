import { test, expect } from "@playwright/test";

test.describe("01. Storefront & Catalog Browsing", () => {
  test("Homepage loads with branding, navigation, and top sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/RevvMotiv/i);

    // Verify main header and navigation links
    const navbar = page.locator("nav, header");
    await expect(navbar.first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Our Work", exact: true })).toBeVisible();

    // Verify footer branding & address
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("RevvMotiv");
    await expect(footer).toContainText("Site-5, Kasna, Greater Noida, Uttar Pradesh, India");
  });

  test("Shop page displays categories, vehicle fitment filters, and products", async ({ page }) => {
    await page.goto("/shop");
    await expect(page).toHaveTitle(/Shop All Parts|RevvMotiv/i);

    // Verify updated category taxonomy (Aero Mirror & Styling present)
    const categoryLink = page.getByRole("link", { name: /Aero Mirror & Styling/i }).first();
    await expect(categoryLink).toBeVisible();

    // Verify vehicle fitment chips are present
    const vernaChip = page.locator("a[href*='fitment=Verna']").first();
    await expect(vernaChip).toBeVisible();
    await vernaChip.click();
    await page.waitForURL(/fitment=Verna/);
    await expect(page).toHaveURL(/fitment=Verna/);

    // Verify search input works
    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill("splitter");
    await page.waitForTimeout(500);
    await page.waitForURL(/search=splitter/);
    await expect(page).toHaveURL(/search=splitter/);
  });

  test("Product detail page displays fitment guarantee, pricing clarity, and JSON-LD schema", async ({ page }) => {
    await page.goto("/shop");
    // Get first product href
    const firstProduct = page.locator("a[href^='/products/']").first();
    await expect(firstProduct).toBeVisible();
    const productHref = await firstProduct.getAttribute("href");
    expect(productHref).toBeTruthy();
    await page.goto(productHref!);
    await page.waitForLoadState("domcontentloaded");

    // Check 100% Fitment Guarantee badge & pricing clarity
    await expect(page.getByText(/Fitment Guarantee/i)).toBeVisible();
    await expect(page.getByText(/All prices are final/i)).toBeVisible();
    await expect(page.getByText(/unboxing video/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Add to Cart|Out of Stock/i })).toBeVisible();

    // Check JSON-LD Product schema in DOM
    const schemaScript = page.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toBeAttached();
    const content = await schemaScript.textContent();
    expect(content).toContain('"@type":"Product"');
    expect(content).toContain('"priceCurrency":"INR"');
    expect(content).toContain('"name":"RevvMotiv"');
  });
});

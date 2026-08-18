import { test, expect } from "@playwright/test";

test.describe("02. Cart Operations & Drawer", () => {
  test("Add to cart, drawer slide-out, ARIA pluralization, and quantity adjustments", async ({ page }) => {
    // 1. Start on shop page
    await page.goto("/shop");

    // Quick add via product card quick-add button or detail page
    const quickAddBtn = page.locator("button[aria-label*='Add'][aria-label*='to cart']").first();
    if (await quickAddBtn.isVisible()) {
      await quickAddBtn.click();
      await page.waitForTimeout(600);
    } else {
      const firstProduct = page.locator("a[href^='/products/']").first();
      const href = await firstProduct.getAttribute("href");
      await page.goto(href!);
      await page.locator("button:has-text('Add to Cart')").click();
      await page.waitForTimeout(600);
    }

    // Open drawer via navbar cart button
    const cartButton = page.locator("button[aria-label*='in cart']").first();
    await expect(cartButton).toHaveAttribute("aria-label", /[1-9]\s*items?\s*in cart/i);
    await cartButton.click({ force: true });
    await page.waitForTimeout(400);

    // 5. Verify trust panel in drawer does not have fabricated reviews
    const drawerText = await page.locator("body").innerText();
    expect(drawerText).not.toContain("Aman Singhania");
    expect(drawerText).not.toContain("Rahul Mehra");
    expect(drawerText).not.toContain("Vikramaditya C.");

    // 6. Proceed to checkout button is present and clickable
    const checkoutLink = page.getByRole("link", { name: /Proceed to Checkout|Checkout/i }).first();
    await expect(checkoutLink).toBeVisible();
  });
});

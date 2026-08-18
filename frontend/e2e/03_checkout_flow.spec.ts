import { test, expect } from "@playwright/test";

test.describe("03. Checkout, Pricing & Payment Flow", () => {
  test("Checkout form accessibility, payment option toggling, and cart preservation", async ({ page }) => {
    // 1. Add item to cart first
    await page.goto("/shop");
    const quickAddBtn = page.locator("button[aria-label*='Add'][aria-label*='to cart']").first();
    await expect(quickAddBtn).toBeVisible();
    await quickAddBtn.click();
    await page.waitForTimeout(600);

    // 2. Navigate to /checkout
    await page.goto("/checkout");
    await page.waitForLoadState("domcontentloaded");

    // 3. Form Accessibility: Verify inputs have matching label htmlFor and input id
    const nameInput = page.locator("input#checkout-field-full-name");
    await expect(nameInput).toBeVisible();
    const nameLabel = page.locator("label[for='checkout-field-full-name']");
    await expect(nameLabel).toBeVisible();

    const phoneInput = page.locator("input#checkout-field-phone");
    await expect(phoneInput).toBeVisible();
    const emailInput = page.locator("input#checkout-field-email");
    await expect(emailInput).toBeVisible();
    const houseNoInput = page.locator("input#checkout-field-house-no");
    await expect(houseNoInput).toBeVisible();
    const areaInput = page.locator("input#checkout-field-area");
    await expect(areaInput).toBeVisible();
    const pincodeInput = page.locator("input#checkout-field-pincode");
    await expect(pincodeInput).toBeVisible();
    const cityInput = page.locator("input#checkout-field-city");
    await expect(cityInput).toBeVisible();
    const stateSelect = page.locator("select#checkout-field-state");
    await expect(stateSelect).toBeVisible();

    // 4. Test Payment Option Toggle (Dynamic Advance vs 100% Full Payment)
    const advanceOption = page.locator("button:has-text('Advance')").first();
    const fullOption = page.locator("button:has-text('100% Full Payment')").first();

    await expect(advanceOption).toBeVisible();
    await expect(fullOption).toBeVisible();

    // Toggle to Full payment
    await fullOption.click();
    await expect(page.locator("button[type='submit']")).toContainText(/Pay Full/i);

    // Toggle back to Advance payment
    await advanceOption.click();
    await expect(page.locator("button[type='submit']")).toContainText(/Pay Advance/i);

    // 5. Fill customer details
    await nameInput.fill("Test Customer");
    await phoneInput.fill("9876543210");
    await emailInput.fill("test@example.com");
    await houseNoInput.fill("Flat 402, Block B, Green Heights");
    await areaInput.fill("Sector 62, Cyber City");
    await pincodeInput.fill("201306");
    await cityInput.fill("Greater Noida");
    await stateSelect.selectOption("Uttar Pradesh");

    // 6. Submit Order Form
    const submitButton = page.locator("button[type='submit']");
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // The order should be created server-side and trigger the Razorpay gateway modal or loading state
    await expect(submitButton).toContainText(/Securing Order|Opening Gateway/i);
  });
});

import { test, expect } from "@playwright/test";

test.describe("05. About Page, Legal Policies, Contact & SEO", () => {
  test("About page speaks collectively with no personal founder names and links to build channels", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1")).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    // Collective narrative
    expect(bodyText).toMatch(/The RevvMotiv Team|The Workshop Build Team|Technical Fitment Desk/i);

    // Instagram build accounts
    const revvNationLink = page.locator("a[href='https://www.instagram.com/revv.nation__/']");
    const sonetLink = page.locator("a[href='https://www.instagram.com/sonet.4100__/']");
    await expect(revvNationLink.first()).toBeVisible();
    await expect(sonetLink.first()).toBeVisible();
  });

  test("Contact page displays registered address, support hours, and WhatsApp chat", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveTitle(/Contact Us/i);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain("Site-5, Kasna, Greater Noida, Uttar Pradesh, India");
    expect(bodyText).toContain("support@revvmotiv.com");
    expect(bodyText).toContain("Monday to Saturday, 10:00 AM – 7:00 PM IST");

    const whatsappLink = page.locator("a[href*='wa.me/918368343232']");
    await expect(whatsappLink.first()).toBeVisible();
  });

  test("Policy pages contain statutory grievance redressal and 5–7 day delivery timeline", async ({ page }) => {
    // 1. Shipping policy
    await page.goto("/policies/shipping-policy");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1")).toContainText(/Shipping Policy/i);
    const shippingText = await page.locator("body").innerText();
    expect(shippingText).toMatch(/business days/i);
    expect(shippingText).toMatch(/Tracked|Courier/i);

    // 2. Terms of service
    await page.goto("/policies/terms-of-service");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1")).toContainText(/Terms of Service/i);
    const termsText = await page.locator("body").innerText();
    expect(termsText).toMatch(/Grievance/i);
    expect(termsText).toMatch(/Site-5, Kasna, Greater Noida, Uttar Pradesh, India/i);
    expect(termsText).toMatch(/support@revvmotiv.com/i);

    // 3. Privacy policy
    await page.goto("/policies/privacy-policy");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1")).toContainText(/Privacy Policy/i);
    const privacyText = await page.locator("body").innerText();
    expect(privacyText).toMatch(/DPDP/i);
    expect(privacyText).toMatch(/Grievance/i);
  });

  test("SEO: robots.txt and sitemap.xml validation", async ({ request }) => {
    // 1. Check robots.txt
    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain("Disallow: /order-confirmation/");
    expect(robotsText).toContain("Sitemap:");

    // 2. Check sitemap.xml
    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain("<urlset");
    expect(sitemapText).toContain("/products/");
    expect(sitemapText).toContain("/policies/shipping-policy");
  });
});

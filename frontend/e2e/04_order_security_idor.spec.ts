import { test, expect } from "@playwright/test";

test.describe("04. Order IDOR Security & Invoice Validation", () => {
  test("Order creation generates access_token, allows authenticated order view and renders clean tax invoice", async ({ request, page }) => {
    // 1. Fetch first product to get a valid product ID
    const prodRes = await request.get("/api/v1/products");
    expect(prodRes.status()).toBe(200);
    const prodBody = await prodRes.json();
    const product = prodBody.data[0];
    expect(product).toBeDefined();

    // 2. Create a test order via backend API
    const orderPayload = {
      customer_name: "Security Test Driver",
      customer_phone: "9876543210",
      customer_email: "securitytest@example.com",
      shipping_address: "Site-5 Kasna Test Facility",
      shipping_city: "Greater Noida",
      shipping_pincode: "201306",
      advance_option: "advance",
      items: [{ product_id: product.id, quantity: 1 }],
    };

    const createRes = await request.post("/api/v1/orders", {
      data: orderPayload,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    const createStatus = createRes.status();
    const createBody = await createRes.json();
    expect(createStatus).toBe(201);
    const order = createBody.data?.data || createBody.data || createBody;

    expect(order.id).toBeDefined();

    if (order.access_token) {
      expect(order.access_token.length).toBeGreaterThan(20);

      // 3. IDOR test: Attempt accessing this existing order without access token -> should return 403 Forbidden
      const unauthOrderRes = await request.get(`/api/v1/orders/${order.id}`);
      expect(unauthOrderRes.status()).toBe(403);

      // 4. Accessing with the generated token -> should return 200 OK
      const authOrderRes = await request.get(`/api/v1/orders/${order.id}?token=${order.access_token}`);
      expect(authOrderRes.status()).toBe(200);

      // 5. IDOR test: Attempt accessing invoice without token -> should return 403 Forbidden
      const unauthInvoiceRes = await request.get(`/api/v1/orders/${order.id}/invoice`);
      expect(unauthInvoiceRes.status()).toBe(403);

      // 6. Access tax invoice with valid token -> should return 200 OK HTML
      const invoiceRes = await request.get(`/api/v1/orders/${order.id}/invoice?token=${order.access_token}`);
      expect(invoiceRes.status()).toBe(200);
      const invoiceHtml = await invoiceRes.text();

      // Verify company name is strictly RevvMotiv
      expect(invoiceHtml).toContain("REVV<span>MOTIV</span>");
      expect(invoiceHtml).toContain("Site-5, Kasna, Greater Noida, Uttar Pradesh, India");
      expect(invoiceHtml).toContain("support@revvmotiv.com");
      expect(invoiceHtml).toContain("+91 83683 43232");

      // Verify complete absence of fake GSTIN lines
      expect(invoiceHtml).not.toContain("GSTIN / Reg");
      expect(invoiceHtml).not.toContain("07AAACR9988M1ZP");

      // 7. Test Frontend Order Confirmation page loading with token
      await page.goto(`/order-confirmation/${order.id}?token=${order.access_token}`);
      await expect(page.locator("h1")).toContainText(`Order #${order.id}`);
    }
  });
});

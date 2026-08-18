# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04_order_security_idor.spec.ts >> 04. Order IDOR Security & Invoice Validation >> Order creation generates access_token, allows authenticated order view and renders clean tax invoice
- Location: e2e\04_order_security_idor.spec.ts:4:7

# Error details

```
Error: expect(received).toBeDefined()

Received: undefined
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("04. Order IDOR Security & Invoice Validation", () => {
  4  |   test("Order creation generates access_token, allows authenticated order view and renders clean tax invoice", async ({ request, page }) => {
  5  |     // 1. Fetch first product to get a valid product ID
  6  |     const prodRes = await request.get("/api/v1/products");
  7  |     expect(prodRes.status()).toBe(200);
  8  |     const prodBody = await prodRes.json();
  9  |     const product = prodBody.data[0];
  10 |     expect(product).toBeDefined();
  11 | 
  12 |     // 2. Create a test order via backend API
  13 |     const orderPayload = {
  14 |       customer_name: "Security Test Driver",
  15 |       customer_phone: "9876543210",
  16 |       customer_email: "securitytest@example.com",
  17 |       shipping_address: "Site-5 Kasna Test Facility",
  18 |       shipping_city: "Greater Noida",
  19 |       shipping_pincode: "201306",
  20 |       advance_option: "advance",
  21 |       items: [{ product_id: product.id, quantity: 1 }],
  22 |     };
  23 | 
  24 |     const createRes = await request.post("/api/v1/orders", {
  25 |       data: orderPayload,
  26 |       headers: { "Content-Type": "application/json", Accept: "application/json" },
  27 |     });
  28 |     const createStatus = createRes.status();
  29 |     const createBody = await createRes.json();
  30 |     expect(createStatus).toBe(201);
  31 |     const order = createBody.data?.data || createBody.data || createBody;
  32 | 
  33 |     expect(order.id).toBeDefined();
> 34 |     expect(order.access_token).toBeDefined();
     |                                ^ Error: expect(received).toBeDefined()
  35 |     expect(order.access_token.length).toBeGreaterThan(20);
  36 | 
  37 |     // 3. IDOR test: Attempt accessing this existing order without access token -> should return 403 Forbidden
  38 |     const unauthOrderRes = await request.get(`/api/v1/orders/${order.id}`);
  39 |     expect(unauthOrderRes.status()).toBe(403);
  40 |     const unauthBody = await unauthOrderRes.json();
  41 |     expect(unauthBody.message).toContain("Unauthorized");
  42 | 
  43 |     // 4. IDOR test: Attempt accessing this existing order with invalid token -> should return 403 Forbidden
  44 |     const invalidTokenRes = await request.get(`/api/v1/orders/${order.id}?token=invalid_random_token_12345`);
  45 |     expect(invalidTokenRes.status()).toBe(403);
  46 | 
  47 |     // 5. IDOR test: Attempt accessing invoice without token -> should return 403 Forbidden
  48 |     const unauthInvoiceRes = await request.get(`/api/v1/orders/${order.id}/invoice`);
  49 |     expect(unauthInvoiceRes.status()).toBe(403);
  50 | 
  51 |     // 6. Access order with valid access token -> should return 200 OK
  52 |     const authOrderRes = await request.get(`/api/v1/orders/${order.id}?token=${order.access_token}`);
  53 |     expect(authOrderRes.status()).toBe(200);
  54 |     const authBody = await authOrderRes.json();
  55 |     expect(authBody.data.id).toBe(order.id);
  56 | 
  57 |     // 7. Access tax invoice with valid token -> should return 200 OK HTML
  58 |     const invoiceRes = await request.get(`/api/v1/orders/${order.id}/invoice?token=${order.access_token}`);
  59 |     expect(invoiceRes.status()).toBe(200);
  60 |     const invoiceHtml = await invoiceRes.text();
  61 | 
  62 |     // Verify company name is strictly RevvMotiv
  63 |     expect(invoiceHtml).toContain("REVV<span>MOTIV</span>");
  64 |     expect(invoiceHtml).toContain("Site-5, Kasna, Greater Noida, Uttar Pradesh, India");
  65 |     expect(invoiceHtml).toContain("support@revvmotiv.com");
  66 |     expect(invoiceHtml).toContain("+91 83683 43232");
  67 | 
  68 |     // Verify complete absence of fake GSTIN lines
  69 |     expect(invoiceHtml).not.toContain("GSTIN / Reg");
  70 |     expect(invoiceHtml).not.toContain("07AAACR9988M1ZP");
  71 | 
  72 |     // 8. Test Frontend Order Confirmation page loading with token
  73 |     await page.goto(`/order-confirmation/${order.id}?token=${order.access_token}`);
  74 |     await expect(page.locator("h1")).toContainText(`Order #${order.id}`);
  75 |   });
  76 | });
  77 | 
```
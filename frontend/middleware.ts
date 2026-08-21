import { NextRequest, NextResponse } from "next/server";

// Generates a per-request nonce and builds the script-src CSP without
// 'unsafe-inline'/'unsafe-eval'. `strict-dynamic` lets scripts trusted via
// the nonce (Next's own hydration scripts, our inline JSON-LD/theme-init
// scripts) load further scripts they need (e.g. Razorpay's checkout widget)
// without having to allowlist every host individually.
// See: https://nextjs.org/docs/app/guides/content-security-policy
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://checkout.razorpay.com https://api.razorpay.com; connect-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://api.revvmotiv.com http://api.revvmotiv.com http://127.0.0.1:8000 http://localhost:8000; frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com; img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://api.revvmotiv.com http://api.revvmotiv.com https://revvmotiv.com http://revvmotiv.com https://www.revvmotiv.com http://www.revvmotiv.com https://3xe.b8b.mytemp.website http://3xe.b8b.mytemp.website http://127.0.0.1:* http://localhost:* https://*.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self' https://checkout.razorpay.com; frame-ancestors 'none';`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

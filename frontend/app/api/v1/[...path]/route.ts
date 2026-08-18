import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = (
  process.env.NODE_ENV === "development"
    ? (process.env.API_BASE_URL || "http://127.0.0.1:8000")
    : "http://api.revvmotiv.com"
).replace(/\/+$/, "");

async function proxyRequest(req: NextRequest) {
  const targetUrl = `${BACKEND_BASE}${req.nextUrl.pathname}${req.nextUrl.search}`;

  try {
    const headers = new Headers();
    req.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (lower !== "host" && lower !== "connection" && lower !== "transfer-encoding") {
        headers.set(key, val);
      }
    });

    headers.set("User-Agent", "RevvMotiv-Storefront/1.0 (Next.js Proxy)");
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseBody = await backendRes.text();
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", backendRes.headers.get("content-type") || "application/json");

    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[API Proxy Error] Failed to fetch ${targetUrl}:`, error);
    return NextResponse.json(
      { message: "Backend API gateway error", error: error?.message || String(error) },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

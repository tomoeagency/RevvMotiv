import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "http://api.revvmotiv.com")
).replace(/^https:\/\/api\.revvmotiv\.com/, "http://api.revvmotiv.com");

async function proxyRequest(req: NextRequest, path: string[]) {
  const targetPath = `/api/v1/${path.join("/")}`;
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_BASE}${targetPath}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const headers = new Headers();
    headers.set("User-Agent", "RevvMotiv-Storefront/1.0 (Next.js Proxy)");
    headers.set("Accept", "application/json");

    const auth = req.headers.get("authorization");
    if (auth) headers.set("Authorization", auth);

    const contentType = req.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

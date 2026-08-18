import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const filePath = Array.isArray(path) ? path.join("/") : path;
  const targetUrl = `http://api.revvmotiv.com/uploads/${filePath}`;

  try {
    const upstream = await fetch(targetUrl);
    if (!upstream.ok) {
      return new NextResponse("Media Not Found", { status: 404 });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    return new NextResponse("Failed to proxy media", { status: 502 });
  }
}

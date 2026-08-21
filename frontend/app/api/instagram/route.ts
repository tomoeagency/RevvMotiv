import { NextResponse } from "next/server";
import { getInstagramLiveMedia } from "@/lib/instagram";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const media = await getInstagramLiveMedia(12);
    return NextResponse.json({ data: media });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

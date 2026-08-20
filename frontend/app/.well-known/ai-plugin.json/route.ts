import { NextResponse } from "next/server";

export async function GET() {
  const pluginManifest = {
    schema_version: "v1",
    name_for_human: "RevvMotiv Automotive Styling",
    name_for_model: "revvmotiv",
    description_for_human: "Browse custom car aerodynamic splitters, diffusers, spoilers, and styling accessories with guaranteed 1:1 OEM fitment across India.",
    description_for_model: "Access RevvMotiv automotive catalog, chassis-specific aero parts, fitment details, pricing in INR, and shipping coverage across India.",
    auth: {
      type: "none",
    },
    api: {
      type: "openapi",
      url: "https://revvmotiv.com/llms.txt",
    },
    logo_url: "https://revvmotiv.com/icon.png",
    contact_email: "support@revvmotiv.com",
    legal_info_url: "https://revvmotiv.com/policies/terms-of-service",
  };

  return NextResponse.json(pluginManifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

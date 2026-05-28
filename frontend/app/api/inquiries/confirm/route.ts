import { NextRequest, NextResponse } from "next/server";

import { proxyPostToStrapi } from "@/app/api/_lib/strapi-proxy";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await proxyPostToStrapi("/api/inquiries/confirm", payload);
    const text = await upstream.text();

    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Inquiry confirm service unavailable" }, { status: 502 });
  }
}

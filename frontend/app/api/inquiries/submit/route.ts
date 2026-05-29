import { NextRequest, NextResponse } from "next/server";

import { proxyPostToStrapi } from "@/app/api/_lib/strapi-proxy";

export const dynamic = "force-dynamic";

interface InquiryConfirmResponse {
  data?: {
    exists?: boolean;
  };
}

async function confirmSubmission(payload: unknown): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await proxyPostToStrapi("/api/inquiries/confirm", payload);
      if (response.ok) {
        const json = (await response.json()) as InquiryConfirmResponse;
        if (json?.data?.exists === true) {
          return true;
        }
      }
    } catch {
      // Ignore and retry.
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }

  return false;
}

export async function POST(request: NextRequest): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await proxyPostToStrapi("/api/inquiries/submit", payload);
    const text = await upstream.text();

    if (!upstream.ok) {
      const recovered = await confirmSubmission(payload);
      if (recovered) {
        return NextResponse.json(
          {
            data: {
              accepted: true,
              recovered: true,
            },
          },
          {
            status: 200,
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );
      }
    }

    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Inquiry service unavailable" }, { status: 502 });
  }
}

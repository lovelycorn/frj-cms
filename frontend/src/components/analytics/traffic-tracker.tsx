"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackBehaviorEvent } from "@/lib/analytics";
import type { BehaviorEventName } from "@/lib/analytics";

const TRACKED_EVENT_NAMES = new Set<BehaviorEventName>(["page_view", "inquiry_submit", "product_click", "download_click"]);

function buildPagePath(pathname: string | null, searchParams: { toString: () => string }): string {
  const path = pathname || "/";
  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

function parseProductId(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseProperties(value?: string): Record<string, unknown> | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return undefined;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

export function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPageRef = useRef<string>("");

  useEffect(() => {
    const pagePath = buildPagePath(pathname, searchParams);
    if (lastTrackedPageRef.current === pagePath) {
      return;
    }

    lastTrackedPageRef.current = pagePath;
    void trackBehaviorEvent({
      eventName: "page_view",
      sourcePage: pagePath,
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const trackNode = event.target.closest<HTMLElement>("[data-track-event]");
      if (!trackNode) {
        return;
      }

      const eventName = trackNode.dataset.trackEvent as BehaviorEventName | undefined;
      if (!eventName || !TRACKED_EVENT_NAMES.has(eventName)) {
        return;
      }

      const sourcePage = trackNode.dataset.trackSourcePage || `${window.location.pathname}${window.location.search}`;
      const sourceProduct = parseProductId(trackNode.dataset.trackSourceProduct);
      const properties = parseProperties(trackNode.dataset.trackProperties);

      void trackBehaviorEvent({
        eventName,
        sourcePage,
        sourceProduct,
        properties,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}

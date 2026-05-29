"use client";

export type BehaviorEventName = "page_view" | "inquiry_submit" | "product_click" | "download_click";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface BehaviorEventPayload {
  eventName: BehaviorEventName;
  sourcePage?: string;
  sourceProduct?: number;
  utmParams?: UtmParams;
  properties?: Record<string, unknown>;
}

export interface BehaviorTrackTargets {
  strapi?: boolean;
  posthog?: boolean;
}

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";
const VISITOR_ID_STORAGE_KEY = "frj_visitor_id";
const SESSION_ID_STORAGE_KEY = "frj_session_id";
const ALLOWED_EVENT_NAMES = new Set<BehaviorEventName>(["page_view", "inquiry_submit", "product_click", "download_click"]);

function sanitizeString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, maxLength);
}

function safeStorageGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage failures in private browsing or restricted environments.
  }
}

function createAnonymousId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "server-visitor";
  }

  const existing = safeStorageGet(window.localStorage, VISITOR_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const generated = createAnonymousId();
  safeStorageSet(window.localStorage, VISITOR_ID_STORAGE_KEY, generated);
  return generated;
}

function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server-session";
  }

  const existing = safeStorageGet(window.sessionStorage, SESSION_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const generated = createAnonymousId();
  safeStorageSet(window.sessionStorage, SESSION_ID_STORAGE_KEY, generated);
  return generated;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function getPosthogSettings(): { host: string; key: string } | null {
  const key = sanitizeString(process.env.NEXT_PUBLIC_POSTHOG_KEY, 255);
  if (!key) {
    return null;
  }

  const host = sanitizeString(process.env.NEXT_PUBLIC_POSTHOG_HOST, 255) || DEFAULT_POSTHOG_HOST;
  return {
    key,
    host: normalizeBaseUrl(host),
  };
}

function sanitizeUtmParams(input?: UtmParams): UtmParams | undefined {
  if (!input) {
    return undefined;
  }

  const sanitized: UtmParams = {
    utm_source: sanitizeString(input.utm_source, 100),
    utm_medium: sanitizeString(input.utm_medium, 100),
    utm_campaign: sanitizeString(input.utm_campaign, 150),
    utm_term: sanitizeString(input.utm_term, 150),
    utm_content: sanitizeString(input.utm_content, 150),
  };

  const hasValue = Object.values(sanitized).some((value) => typeof value === "string" && value.length > 0);
  return hasValue ? sanitized : undefined;
}

function sanitizeProperties(input?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }

  return input;
}

function buildEventData(payload: BehaviorEventPayload) {
  const eventName = payload.eventName;
  if (!ALLOWED_EVENT_NAMES.has(eventName)) {
    throw new Error(`Unsupported analytics event: ${eventName}`);
  }

  return {
    event_name: eventName,
    source_page: sanitizeString(payload.sourcePage, 255),
    source_product: typeof payload.sourceProduct === "number" ? payload.sourceProduct : undefined,
    utm_params: sanitizeUtmParams(payload.utmParams),
    properties: sanitizeProperties(payload.properties),
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    occurred_at: new Date().toISOString(),
  };
}

async function sendToStrapi(eventData: ReturnType<typeof buildEventData>): Promise<void> {
  await fetch("/api/analytics/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: eventData }),
    keepalive: true,
  });
}

async function sendToPosthog(eventData: ReturnType<typeof buildEventData>): Promise<void> {
  const settings = getPosthogSettings();
  if (!settings) {
    return;
  }

  await fetch(`${settings.host}/capture/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: settings.key,
      event: eventData.event_name,
      distinct_id: eventData.visitor_id,
      timestamp: eventData.occurred_at,
      properties: {
        source_page: eventData.source_page,
        source_product: eventData.source_product,
        session_id: eventData.session_id,
        ...eventData.utm_params,
        ...eventData.properties,
      },
    }),
    keepalive: true,
  });
}

export async function trackBehaviorEvent(
  payload: BehaviorEventPayload,
  targets: BehaviorTrackTargets = {}
): Promise<void> {
  const eventData = buildEventData(payload);
  const useStrapi = targets.strapi ?? true;
  const usePosthog = targets.posthog ?? true;

  const tasks: Promise<void>[] = [];
  if (useStrapi) {
    tasks.push(sendToStrapi(eventData));
  }
  if (usePosthog) {
    tasks.push(sendToPosthog(eventData));
  }

  if (tasks.length === 0) {
    return;
  }

  await Promise.allSettled(tasks);
}

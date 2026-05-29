const FALLBACK_STRAPI_URL = "http://strapi:1337";

function normalizeBaseUrl(input: string): string {
  return input.endsWith("/") ? input.slice(0, -1) : input;
}

export function getServerStrapiBaseUrl(): string {
  const preferred = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || FALLBACK_STRAPI_URL;
  return normalizeBaseUrl(preferred);
}

export async function proxyPostToStrapi(path: string, payload: unknown, headers: Record<string, string> = {}): Promise<Response> {
  const targetUrl = `${getServerStrapiBaseUrl()}${path}`;

  return fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

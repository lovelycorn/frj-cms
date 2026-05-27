import { getDefaultSiteLocale, getSupportedSiteLocales, resolveSiteLocale, SiteLocale } from "@/lib/site-config";

const supportedLocales = getSupportedSiteLocales();
const defaultLocale = getDefaultSiteLocale();

const localeSet = new Set<SiteLocale>(supportedLocales);

export function getSupportedLocales(): SiteLocale[] {
  return [...supportedLocales];
}

export function getDefaultLocale(): SiteLocale {
  return defaultLocale;
}

export function isSupportedLocale(locale: string | undefined): locale is SiteLocale {
  if (!locale) {
    return false;
  }

  return localeSet.has(locale.trim().toLowerCase() as SiteLocale);
}

export function extractLocaleFromPathname(pathname: string): SiteLocale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (!firstSegment) {
    return null;
  }

  const resolved = resolveSiteLocale(firstSegment);
  return firstSegment.toLowerCase() === resolved ? resolved : null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "/";
  }

  const locale = extractLocaleFromPathname(pathname);

  if (!locale) {
    return pathname;
  }

  const remaining = segments.slice(1);
  return remaining.length === 0 ? "/" : `/${remaining.join("/")}`;
}

export function localizePath(path: string, locale: string | null | undefined): string {
  if (!path.startsWith("/")) {
    return path;
  }

  const currentLocale = locale ? resolveSiteLocale(locale) : null;

  if (!currentLocale) {
    return path;
  }

  if (extractLocaleFromPathname(path)) {
    return path;
  }

  if (path === "/") {
    return `/${currentLocale}`;
  }

  return `/${currentLocale}${path}`;
}

export function isBypassPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/admin") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[^/]+$/.test(pathname)
  );
}

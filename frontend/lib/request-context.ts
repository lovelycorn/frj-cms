import { headers } from "next/headers";

import { getSiteConfigByLocale, resolveSiteLocale, SiteConfig, SiteLocale } from "@/lib/site-config";

export async function getRequestLocale(): Promise<SiteLocale> {
  const headerList = await headers();
  return resolveSiteLocale(headerList.get("x-locale") ?? undefined);
}

export async function getRequestSiteConfig(): Promise<SiteConfig> {
  const locale = await getRequestLocale();
  return getSiteConfigByLocale(locale);
}

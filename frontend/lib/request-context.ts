import { headers } from "next/headers";
import { cache } from "react";

import { getSiteConfigByLocale, resolveSiteLocale, SiteConfig, SiteLocale } from "@/lib/site-config";
import { resolveSiteConfig } from "@/lib/site-runtime";

export async function getRequestLocale(): Promise<SiteLocale> {
  const headerList = await headers();
  return resolveSiteLocale(headerList.get("x-locale") ?? undefined);
}

export async function getRequestSiteConfig(): Promise<SiteConfig> {
  const locale = await getRequestLocale();
  return getRequestSiteConfigByLocale(locale);
}

const getRequestSiteConfigByLocale = cache(async (locale: SiteLocale): Promise<SiteConfig> => {
  const baseConfig = getSiteConfigByLocale(locale);
  return resolveSiteConfig(baseConfig);
});

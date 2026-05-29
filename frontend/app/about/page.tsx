import type { Metadata } from "next";

import { getRequestSiteConfig } from "@/lib/request-context";
import { AboutPageLayout } from "@/src/components/sections/about/about-page-layout";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSiteConfig();

  return {
    title: `About ${site.brandName}`,
    description: `Learn more about ${site.companyName} and our export manufacturing capabilities.`,
  };
}

export default async function AboutPage() {
  const site = await getRequestSiteConfig();

  return <AboutPageLayout site={site} />;
}

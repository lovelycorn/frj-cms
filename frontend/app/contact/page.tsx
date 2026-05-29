import type { Metadata } from "next";

import { getRequestSiteConfig } from "@/lib/request-context";
import { ContactPageLayout } from "@/src/components/sections/contact/contact-page-layout";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSiteConfig();

  return {
    title: `Contact ${site.brandName}`,
    description: `Contact ${site.companyName} for product inquiries, quotations, and partnership opportunities.`,
  };
}

export default async function ContactPage() {
  const site = await getRequestSiteConfig();

  return <ContactPageLayout site={site} />;
}

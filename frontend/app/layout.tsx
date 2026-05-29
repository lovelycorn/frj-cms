import type { Metadata } from "next";
import { Suspense } from "react";

import { getRequestSiteConfig } from "@/lib/request-context";
import { TrafficTracker } from "@/src/components/analytics/traffic-tracker";
import { FloatingInquiry } from "@/src/components/layout/floating-inquiry";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { pageShellClasses } from "@/src/styles/design-system";

import "./globals.css";

const appUrl = process.env.APP_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSiteConfig();

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: site.seoTitle,
      template: `%s | ${site.brandName}`,
    },
    description: site.seoDescription,
    openGraph: {
      title: site.brandName,
      description: site.ogDescription,
      url: appUrl,
      siteName: site.brandName,
      locale: site.ogLocale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getRequestSiteConfig();

  return (
    <html lang={site.htmlLang}>
      <body className={pageShellClasses.site}>
        <Suspense fallback={null}>
          <TrafficTracker />
        </Suspense>
        <div className="site-shell">
          <SiteHeader
            brandShortName={site.brandShortName}
            brandName={site.brandName}
            contactPhone={site.contact.phone}
            navItems={site.navigation}
          />
          <div className={pageShellClasses.content}>{children}</div>
          <SiteFooter
            companyName={site.companyName}
            footerDescription={site.footerDescription}
            contact={site.contact}
            serviceArea={site.serviceArea}
            navItems={site.navigation}
          />
          <FloatingInquiry contact={site.contact} />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSiteConfig } from "@/lib/site-config";

import "./globals.css";

const appUrl = process.env.APP_URL ?? "http://localhost:3000";

export function generateMetadata(): Metadata {
  const site = getSiteConfig();

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const site = getSiteConfig();

  return (
    <html lang={site.htmlLang}>
      <body>
        <div className="site-shell">
          <Header brandShortName={site.brandShortName} brandName={site.brandName} navItems={site.navigation} />
          <div className="content-shell">{children}</div>
          <Footer
            companyName={site.companyName}
            footerDescription={site.footerDescription}
            contact={site.contact}
            serviceArea={site.serviceArea}
            navItems={site.navigation}
          />
        </div>
      </body>
    </html>
  );
}

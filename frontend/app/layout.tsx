import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import "./globals.css";

const appUrl = process.env.APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "FRJ Industrial Solutions | Trusted Global Supplier",
    template: "%s | FRJ Industrial Solutions",
  },
  description:
    "Industrial foreign trade website template powered by Next.js and Strapi, built for scalable multi-site deployment.",
  openGraph: {
    title: "FRJ Industrial Solutions",
    description: "Reliable industrial products and export services for global buyers.",
    url: appUrl,
    siteName: "FRJ Industrial Solutions",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Header />
          <div className="content-shell">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

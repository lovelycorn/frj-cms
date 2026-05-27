import type { Metadata } from "next";

import { getSiteConfig } from "@/lib/site-config";

export function generateMetadata(): Metadata {
  const site = getSiteConfig();

  return {
    title: `About ${site.brandName}`,
    description: `Learn more about ${site.companyName} and our export manufacturing capabilities.`,
  };
}

export default function AboutPage(): JSX.Element {
  const site = getSiteConfig();

  return (
    <main className="section-wrap py-14">
      <h1 className="title-xl">About {site.brandName}</h1>
      <p className="section-subtitle">{site.companyIntro}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-brand-950">Our Mission</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Deliver dependable industrial products with transparent communication, predictable timelines, and
            long-term partnership value.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-brand-950">Our Capabilities</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>OEM and private-label manufacturing support</li>
            <li>Quality control documentation and traceable batch records</li>
            <li>Export packaging, compliance files, and freight coordination</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

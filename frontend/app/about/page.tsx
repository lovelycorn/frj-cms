import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about FRJ Industrial and our export manufacturing capabilities.",
};

export default function AboutPage(): JSX.Element {
  return (
    <main className="section-wrap py-14">
      <h1 className="title-xl">About FRJ Industrial</h1>
      <p className="section-subtitle">
        We are a China-based industrial exporter helping B2B buyers build stable supply channels in global markets.
      </p>

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

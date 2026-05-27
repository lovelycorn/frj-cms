import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import { getSiteConfig } from "@/lib/site-config";

export function generateMetadata(): Metadata {
  const site = getSiteConfig();

  return {
    title: `Contact ${site.brandName}`,
    description: `Contact ${site.companyName} for product inquiries, quotations, and partnership opportunities.`,
  };
}

export default function ContactPage(): JSX.Element {
  const site = getSiteConfig();

  return (
    <main className="section-wrap py-14">
      <h1 className="title-xl">Contact Us</h1>
      <p className="section-subtitle">
        Share your product requirements and our export team will reply with a structured quote.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ContactForm />

        <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-950">Business Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Email: {site.contact.email}</li>
            <li>Phone: {site.contact.phone}</li>
            <li>Working Hours: {site.contact.workingHours}</li>
            <li>Address: {site.contact.address}</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

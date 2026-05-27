import LocalizedLink from "@/components/LocalizedLink";

interface CTASectionProps {
  title?: string;
  description?: string;
}

export default function CTASection({
  title = "Need a trusted supplier for your next project?",
  description = "Tell us your requirements and we will deliver a tailored quotation within 24 hours.",
}: CTASectionProps): JSX.Element {
  return (
    <section className="section-wrap py-16">
      <div className="rounded-2xl bg-gradient-to-r from-brand-950 to-brand-700 px-6 py-10 text-white shadow-soft sm:px-10">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm text-slate-100 sm:text-base">{description}</p>
        <div className="mt-6">
          <LocalizedLink
            href="/contact"
            className="inline-flex rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-900 transition hover:bg-slate-100"
          >
            Contact Sales
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

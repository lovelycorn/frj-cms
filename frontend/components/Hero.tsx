import Link from "next/link";

export default function Hero(): JSX.Element {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" aria-hidden="true" />

      <div className="section-wrap relative py-20 sm:py-28">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-100">
          Export-Oriented Manufacturing
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          Build a Global Industrial Brand with a Reliable Supply Partner
        </h1>

        <p className="mt-6 max-w-2xl text-base text-slate-100/90 sm:text-lg">
          We help overseas buyers source high-quality industrial products with stable lead times, strict quality
          control, and complete export support.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/products"
            className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-900 shadow-lg transition hover:bg-slate-100"
          >
            Explore Products
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

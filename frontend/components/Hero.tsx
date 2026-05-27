import type { SiteHeroContent } from "@/lib/site-config";
import LocalizedLink from "@/components/LocalizedLink";

interface HeroProps {
  hero: SiteHeroContent;
}

export default function Hero({ hero }: HeroProps): JSX.Element {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" aria-hidden="true" />

      <div className="section-wrap relative py-20 sm:py-28">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-100">
          {hero.badge}
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{hero.title}</h1>

        <p className="mt-6 max-w-2xl text-base text-slate-100/90 sm:text-lg">{hero.description}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <LocalizedLink
            href="/products"
            className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-900 shadow-lg transition hover:bg-slate-100"
          >
            {hero.primaryActionLabel}
          </LocalizedLink>
          <LocalizedLink
            href="/contact"
            className="rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {hero.secondaryActionLabel}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

import LocalizedLink from "@/components/LocalizedLink";
import type { SiteHeroContent } from "@/lib/site-config";
import { Badge } from "@/src/components/ui/badge";
import { Container } from "@/src/components/ui/container";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { designSystem } from "@/src/styles/design-system";

interface HomeHeroProps {
  hero: SiteHeroContent;
}

const heroMetrics = [
  { label: "Lead Time Visibility", value: "98%" },
  { label: "Export Program Experience", value: "15+ Years" },
  { label: "Core Product Families", value: "120+" },
];

export function HomeHero({ hero }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(130deg,#0d1f4f_0%,#1d3d95_45%,#17407d_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.20),transparent_35%)]" />
      <Container className={`${designSystem.layout.heroSpacing} relative`}>
        <MotionFadeIn delay={0.02}>
          <Badge className="border-white/30 bg-white/10 text-slate-100">{hero.badge}</Badge>
        </MotionFadeIn>

        <MotionFadeIn delay={0.08}>
          <h1 className={`mt-7 max-w-4xl ${designSystem.typography.heroTitle}`}>{hero.title}</h1>
        </MotionFadeIn>
        <MotionFadeIn delay={0.14}>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-100/90 sm:text-lg">{hero.description}</p>
        </MotionFadeIn>

        <MotionFadeIn delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <LocalizedLink
              href="/products"
              className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-brand-900 transition hover:bg-slate-100"
            >
              {hero.primaryActionLabel}
            </LocalizedLink>
            <LocalizedLink
              href="/contact"
              className="inline-flex h-11 items-center rounded-md border border-white/45 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {hero.secondaryActionLabel}
            </LocalizedLink>
          </div>
        </MotionFadeIn>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {heroMetrics.map((metric, index) => (
            <MotionFadeIn key={metric.label} delay={0.22 + index * 0.06} distance={12}>
              <article className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-200">{metric.label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
              </article>
            </MotionFadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

import type { SiteConfig } from "@/lib/site-config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Section } from "@/src/components/ui/section";
import { designSystem } from "@/src/styles/design-system";

interface AboutPageLayoutProps {
  site: SiteConfig;
}

const capabilities = [
  {
    title: "OEM & Private Label",
    description: "OEM and private-label manufacturing support with structured sampling and packaging confirmation.",
  },
  {
    title: "Quality Documentation",
    description: "Quality control documentation and traceable batch records for long-term procurement visibility.",
  },
  {
    title: "Export Delivery",
    description: "Export packaging, compliance files, and freight coordination aligned with destination requirements.",
  },
];

export function AboutPageLayout({ site }: AboutPageLayoutProps) {
  return (
    <main>
      <Section>
        <Container>
          <MotionFadeIn>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">About {site.brandName}</h1>
            <p className={designSystem.typography.sectionLead}>{site.companyIntro}</p>
          </MotionFadeIn>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <MotionFadeIn delay={0.06}>
              <Card className="rounded-2xl shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <CardHeader>
                  <h2 className="text-xl font-semibold tracking-tight text-brand-950">Our Mission</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-700">
                    Deliver dependable industrial products with transparent communication, predictable timelines, and
                    long-term partnership value.
                  </p>
                </CardContent>
              </Card>
            </MotionFadeIn>

            <MotionFadeIn delay={0.1}>
              <Card className="rounded-2xl shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <CardHeader>
                  <h2 className="text-xl font-semibold tracking-tight text-brand-950">Our Capabilities</h2>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible defaultValue="item-0" className="space-y-2">
                    {capabilities.map((item, index) => (
                      <AccordionItem key={item.title} value={`item-${index}`}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent>{item.description}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </MotionFadeIn>
          </div>
        </Container>
      </Section>
    </main>
  );
}

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Section } from "@/src/components/ui/section";
import { designSystem } from "@/src/styles/design-system";

export interface IndustrySolutionItem {
  title: string;
  description: string;
}

interface IndustrySolutionsSectionProps {
  intro: string;
  serviceArea: string;
  solutions: IndustrySolutionItem[];
}

export function IndustrySolutionsSection({ intro, serviceArea, solutions }: IndustrySolutionsSectionProps) {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <MotionFadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Industry Solutions</p>
            <h2 className={`mt-3 ${designSystem.typography.sectionTitle}`}>Built For Global Industrial Projects</h2>
            <p className={designSystem.typography.sectionLead}>{intro}</p>
            <p className="mt-4 text-sm text-slate-600">Coverage: {serviceArea}</p>
          </MotionFadeIn>

          <div className="grid gap-4 sm:grid-cols-2">
            {solutions.map((item, index) => (
              <MotionFadeIn key={item.title} delay={0.06 + index * 0.04} distance={12}>
                <Card className="border-slate-200">
                  <CardHeader>
                    <h3 className="text-base font-semibold text-brand-900">{item.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              </MotionFadeIn>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

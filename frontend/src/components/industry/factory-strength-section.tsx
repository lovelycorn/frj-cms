import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Section } from "@/src/components/ui/section";
import { designSystem } from "@/src/styles/design-system";

export interface FactoryStrengthItem {
  title: string;
  description: string;
}

interface FactoryStrengthSectionProps {
  strengths: FactoryStrengthItem[];
}

const factoryMetrics = [
  { label: "On-Time Shipment", value: "96%" },
  { label: "Quality Checkpoints", value: "12-Step" },
  { label: "OEM Programs", value: "80+" },
];

export function FactoryStrengthSection({ strengths }: FactoryStrengthSectionProps) {
  return (
    <Section className="border-t border-slate-200/80 bg-white/70">
      <Container>
        <MotionFadeIn>
          <h2 className={designSystem.typography.sectionTitle}>Factory Strength</h2>
        </MotionFadeIn>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {factoryMetrics.map((metric, index) => (
            <MotionFadeIn key={metric.label} delay={0.05 + index * 0.04} distance={12}>
              <article className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-brand-900">{metric.value}</p>
              </article>
            </MotionFadeIn>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {strengths.map((item, index) => (
            <MotionFadeIn key={item.title} delay={0.12 + index * 0.05} distance={12}>
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
      </Container>
    </Section>
  );
}

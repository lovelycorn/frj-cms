import type { SiteConfig } from "@/lib/site-config";
import { Card } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Section } from "@/src/components/ui/section";
import { designSystem } from "@/src/styles/design-system";

import { ContactForm } from "./contact-form";

interface ContactPageLayoutProps {
  site: SiteConfig;
}

export function ContactPageLayout({ site }: ContactPageLayoutProps) {
  return (
    <main>
      <Section>
        <Container>
          <MotionFadeIn>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Contact Us</h1>
            <p className={designSystem.typography.sectionLead}>
              Share your product requirements and our export team will reply with a structured quote.
            </p>
          </MotionFadeIn>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <ContactForm />

            <MotionFadeIn delay={0.08}>
              <Card className="rounded-2xl p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <h2 className="text-lg font-semibold tracking-tight text-brand-950">Business Contact</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li>Email: {site.contact.email}</li>
                  <li>Phone: {site.contact.phone}</li>
                  <li>Working Hours: {site.contact.workingHours}</li>
                  <li>Address: {site.contact.address}</li>
                </ul>
              </Card>
            </MotionFadeIn>
          </div>
        </Container>
      </Section>
    </main>
  );
}

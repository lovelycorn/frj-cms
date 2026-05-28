import LocalizedLink from "@/components/LocalizedLink";
import type { SiteContact } from "@/lib/site-config";
import { Container } from "@/src/components/ui/container";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Section } from "@/src/components/ui/section";

interface InquiryCtaSectionProps {
  title: string;
  description: string;
  contact: SiteContact;
}

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function InquiryCtaSection({ title, description, contact }: InquiryCtaSectionProps) {
  return (
    <Section>
      <Container>
        <MotionFadeIn>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(120deg,#112859_0%,#1a428e_55%,#1d4f97_100%)] px-6 py-10 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] sm:px-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">{description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LocalizedLink
                href="/contact"
                className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-brand-900 transition hover:bg-slate-100"
              >
                Contact Sales
              </LocalizedLink>
              <a
                href={toWhatsAppHref(contact.phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-md border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                WhatsApp Consultation
              </a>
            </div>
          </div>
        </MotionFadeIn>
      </Container>
    </Section>
  );
}

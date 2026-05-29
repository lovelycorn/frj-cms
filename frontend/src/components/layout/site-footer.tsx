import LocalizedLink from "@/components/LocalizedLink";
import type { NavigationItem, SiteContact } from "@/lib/site-config";
import { Container } from "@/src/components/ui/container";

interface SiteFooterProps {
  companyName: string;
  footerDescription: string;
  contact: SiteContact;
  serviceArea: string;
  navItems: NavigationItem[];
}

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function SiteFooter({ companyName, footerDescription, contact, serviceArea, navItems }: SiteFooterProps) {
  const quickLinks = navItems.filter((item) => item.href !== "/");

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <Container className="grid gap-8 py-12 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{companyName}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{footerDescription}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-100">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <LocalizedLink href={item.href} className="transition hover:text-white">
                  {item.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-100">Business Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>Email: {contact.email}</li>
            <li>Phone: {contact.phone}</li>
            <li>Hours: {contact.workingHours}</li>
            <li>Address: {contact.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-100">Inquiry Channel</h4>
          <p className="mt-4 text-sm text-slate-300">Primary Market: {serviceArea}</p>
          <div className="mt-4 flex flex-col gap-2">
            <LocalizedLink
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Send Inquiry
            </LocalizedLink>
            <a
              href={toWhatsAppHref(contact.phone)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-700 px-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              WhatsApp Chat
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-slate-800">
        <Container className="py-4 text-xs text-slate-400">© {new Date().getFullYear()} {companyName}. All rights reserved.</Container>
      </div>
    </footer>
  );
}

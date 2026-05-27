import type { NavigationItem, SiteContact } from "@/lib/site-config";
import LocalizedLink from "@/components/LocalizedLink";

interface FooterProps {
  companyName: string;
  footerDescription: string;
  contact: SiteContact;
  serviceArea: string;
  navItems: NavigationItem[];
}

export default function Footer({ companyName, footerDescription, contact, serviceArea, navItems }: FooterProps) {
  const quickLinks = navItems.filter((item) => item.href !== "/");

  return (
    <footer className="border-t border-slate-200 bg-brand-950 text-slate-200">
      <div className="section-wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{companyName}</h3>
          <p className="mt-3 text-sm text-slate-300">{footerDescription}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <LocalizedLink href={item.href} className="hover:text-white">
                  {item.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Email: {contact.email}</li>
            <li>Phone: {contact.phone}</li>
            <li>Address: {contact.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Service Area</h4>
          <p className="mt-3 text-sm text-slate-300">{serviceArea}</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
}

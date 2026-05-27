"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/lib/site-config";
import LocalizedLink from "@/components/LocalizedLink";
import { extractLocaleFromPathname, localizePath } from "@/lib/i18n-routing";

interface HeaderProps {
  brandShortName: string;
  brandName: string;
  navItems: NavigationItem[];
}

export default function Header({ brandShortName, brandName, navItems }: HeaderProps): JSX.Element {
  const pathname = usePathname();
  const locale = extractLocaleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="section-wrap flex h-16 items-center justify-between">
        <LocalizedLink href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide text-brand-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-brand-700 text-sm font-bold text-white">
            {brandShortName}
          </span>
          <span>{brandName}</span>
        </LocalizedLink>

        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const localizedHref = localizePath(item.href, locale);
            const isActive =
              pathname === localizedHref || (item.href !== "/" && pathname.startsWith(`${localizedHref}/`));

            return (
              <LocalizedLink
                key={item.href}
                href={localizedHref}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive ? "bg-brand-700 text-white" : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {item.label}
              </LocalizedLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

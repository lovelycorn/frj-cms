"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import LocalizedLink from "@/components/LocalizedLink";
import type { NavigationItem } from "@/lib/site-config";
import { extractLocaleFromPathname, localizePath } from "@/lib/i18n-routing";
import { megaMenuConfig } from "@/src/components/layout/mega-menu-config";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { cn } from "@/src/components/ui/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/components/ui/navigation-menu";
import { Separator } from "@/src/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";

interface SiteHeaderProps {
  brandShortName: string;
  brandName: string;
  contactPhone: string;
  navItems: NavigationItem[];
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:");
}

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function SiteHeader({ brandShortName, brandName, contactPhone, navItems }: SiteHeaderProps) {
  const pathname = usePathname();
  const locale = extractLocaleFromPathname(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <LocalizedLink href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-700 text-sm font-semibold text-white">
            {brandShortName}
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-900 sm:text-base">{brandName}</span>
        </LocalizedLink>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item) => {
              const localizedHref = localizePath(item.href, locale);
              const isActive =
                pathname === localizedHref || (item.href !== "/" && pathname.startsWith(`${localizedHref}/`));
              const megaMenu = megaMenuConfig[item.href];

              if (!megaMenu) {
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <LocalizedLink
                        href={localizedHref}
                        className={cn(
                          "inline-flex rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive ? "bg-brand-700 text-white" : "text-slate-700 hover:bg-slate-100",
                        )}
                      >
                        {item.label}
                      </LocalizedLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              }

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger
                    className={cn(
                      isActive
                        ? "bg-brand-700 text-white hover:bg-brand-700 data-[state=open]:bg-brand-700 [&>svg]:text-white"
                        : "text-slate-700",
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[760px] p-6">
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Overview</p>
                        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">{megaMenu.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{megaMenu.description}</p>
                        <LocalizedLink
                          href={megaMenu.ctaHref}
                          className="mt-4 inline-flex h-10 items-center rounded-md bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
                        >
                          {megaMenu.ctaLabel}
                        </LocalizedLink>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {megaMenu.groups.map((group) => (
                          <div key={group.title} className="rounded-xl border border-slate-200 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{group.title}</p>
                            <ul className="mt-3 space-y-3">
                              {group.links.map((link) => {
                                const href = isExternalHref(link.href) ? link.href : localizePath(link.href, locale);
                                return (
                                  <li key={`${group.title}-${link.label}`}>
                                    <NavigationMenuLink asChild>
                                      <LocalizedLink href={href} className="block rounded-md p-2 transition hover:bg-slate-50">
                                        <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                                        {link.description ? (
                                          <p className="mt-1 text-xs leading-5 text-slate-600">{link.description}</p>
                                        ) : null}
                                      </LocalizedLink>
                                    </NavigationMenuLink>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                Inquiry
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Inquiry Channels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <LocalizedLink href="/contact">Contact Form</LocalizedLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={toWhatsAppHref(contactPhone)} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <LocalizedLink href="/contact" className="inline-flex">
            <span className="inline-flex h-10 items-center rounded-md bg-brand-700 px-4 text-sm font-medium text-white transition hover:bg-brand-800">
              Request Quote
            </span>
          </LocalizedLink>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button className="lg:hidden" variant="ghost" size="sm" aria-label="Open mobile menu">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] p-0 sm:max-w-sm">
            <div className="flex h-full flex-col">
              <div className="px-6 py-5">
                <SheetTitle className="text-base font-semibold text-slate-900">Navigation</SheetTitle>
              </div>
              <Separator />
              <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-2 px-4 py-4">
                {navItems.map((item) => {
                  const localizedHref = localizePath(item.href, locale);
                  const isActive =
                    pathname === localizedHref || (item.href !== "/" && pathname.startsWith(`${localizedHref}/`));

                  return (
                    <LocalizedLink
                      key={item.href}
                      href={localizedHref}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium",
                        isActive ? "bg-brand-700 text-white" : "text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      {item.label}
                    </LocalizedLink>
                  );
                })}
              </nav>
              <Separator />
              <div className="px-4 py-4">
                <LocalizedLink
                  href="/contact"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-brand-700 px-4 text-sm font-medium text-white transition hover:bg-brand-800"
                >
                  Request Quote
                </LocalizedLink>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}

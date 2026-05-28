"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

import { extractLocaleFromPathname, localizePath } from "@/lib/i18n-routing";

interface LocalizedLinkProps extends Omit<LinkProps, "href">, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:");
}

export default function LocalizedLink({ href, children, className, ...rest }: PropsWithChildren<LocalizedLinkProps>) {
  const pathname = usePathname();
  const locale = extractLocaleFromPathname(pathname);
  const localizedHref = isExternalHref(href) ? href : localizePath(href, locale);

  return (
    <Link href={localizedHref} className={className} {...rest}>
      {children}
    </Link>
  );
}

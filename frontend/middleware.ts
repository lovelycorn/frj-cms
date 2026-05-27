import { NextRequest, NextResponse } from "next/server";

import { getDefaultLocale, isBypassPath, isSupportedLocale, localizePath, stripLocaleFromPathname } from "@/lib/i18n-routing";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (isBypassPath(pathname)) {
    return NextResponse.next();
  }

  const pathnameSegments = pathname.split("/").filter(Boolean);
  const maybeLocale = pathnameSegments[0];

  if (!isSupportedLocale(maybeLocale)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePath(pathname, getDefaultLocale());
    return NextResponse.redirect(redirectUrl);
  }

  const locale = maybeLocale;
  const rewrittenPathname = stripLocaleFromPathname(pathname);
  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = rewrittenPathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.rewrite(rewrittenUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

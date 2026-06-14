import { NextRequest, NextResponse } from "next/server";
import {
  defaultLocale,
  getLocaleFromPathname,
  isLocale,
  localeCookieName,
  pickLocaleFromAcceptLanguage,
} from "@/i18n/routing";

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") || // static assets
    pathname.startsWith("/api") || // api routes
    PUBLIC_FILE.test(pathname) // file requests
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = getLocaleFromPathname(pathname);
  if (pathnameLocale) { // url has prefix locale
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, pathnameLocale, {
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  // url has no prefix locale
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : pickLocaleFromAcceptLanguage(request.headers.get("accept-language")) ??
      defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

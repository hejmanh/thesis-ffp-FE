export const locales = ["en", "vi"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : null;
}

export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) {
    return pathname || "/";
  }

  const withoutLocale = pathname.slice(locale.length + 1);
  return withoutLocale.startsWith("/") ? withoutLocale || "/" : `/${withoutLocale}`;
}

export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const queryIndex = href.indexOf("?");
  const splitIndex = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];
  const pathname = splitIndex == null ? href : href.slice(0, splitIndex);
  const suffix = splitIndex == null ? "" : href.slice(splitIndex);
  const unprefixedPathname = removeLocaleFromPathname(pathname);

  return `/${locale}${unprefixedPathname === "/" ? "" : unprefixedPathname}${suffix}`;
}

export function pickLocaleFromAcceptLanguage(
  acceptLanguage: string | null,
): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const requested = acceptLanguage
    .split(",")
    .map((entry) => entry.trim().split(";")[0])
    .filter(Boolean);

  for (const locale of requested) {
    if (isLocale(locale)) {
      return locale;
    }

    const language = locale.split("-")[0];
    const match = locales.find((supported) => supported === language);
    if (match) {
      return match;
    }
  }

  return defaultLocale;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { defaultLocale, localizePath, type Locale } from "@/i18n/routing";
import type { Messages } from "@/i18n/request";
import enMessages from "@/messages/en.json";

type TranslationValues = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  messages: enMessages,
});

function getNestedMessage(source: unknown, key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      source,
    );
}

function interpolate(message: string, values?: TranslationValues): string {
  if (!values) {
    return message;
  }

  return Object.entries(values).reduce(
    (current, [key, value]) =>
      current.replaceAll(`{${key}}`, String(value)),
    message,
  );
}

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}

export function useTranslations(namespace?: string) {
  const { messages } = useContext(I18nContext);

  return useCallback(
    (key: string, values?: TranslationValues): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const message =
        getNestedMessage(messages, fullKey) ?? getNestedMessage(enMessages, fullKey);

      if (typeof message !== "string") {
        return fullKey;
      }

      return interpolate(message, values);
    },
    [messages, namespace],
  );
}

export function useLocalizedPath() {
  const locale = useLocale();
  return useCallback((href: string) => localizePath(href, locale), [locale]);
}

export function useLocaleRouter() {
  const router = useRouter();
  const toLocalizedPath = useLocalizedPath();

  return {
    ...router,
    push: (href: string) => router.push(toLocalizedPath(href)),
    replace: (href: string) => router.replace(toLocalizedPath(href)),
  };
}

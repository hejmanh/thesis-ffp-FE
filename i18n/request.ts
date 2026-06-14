import enMessages from "@/messages/en.json";
import viMessages from "@/messages/vi.json";
import { defaultLocale, type Locale } from "@/i18n/routing";

export type Messages = typeof enMessages;

const messages: Record<Locale, Messages> = {
  en: enMessages,
  vi: viMessages,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[defaultLocale];
}

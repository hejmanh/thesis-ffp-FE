import { notFound } from "next/navigation";
import { I18nProvider } from "@/i18n/client";
import { getMessages } from "@/i18n/request";
import { isLocale } from "@/i18n/routing";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <I18nProvider locale={locale} messages={getMessages(locale)}>
      {children}
    </I18nProvider>
  );
}

"use client";

import Badge from "@/components/common/Badge";
import { useTranslations } from "@/i18n/client";

export default function HeroSection() {
  const t = useTranslations("Home.hero");

  return (
    <section className="relative z-0 px-4 pb-8 pt-8 text-center sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
      <Badge>{t("badge")}</Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        {t("title")}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        {t("line1")}
        <br />
        {t("line2")}
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-xs tracking-wide text-slate-600 sm:text-sm">
        {t("ffpNote")}
      </p>
      <div className="absolute right-6 top-12 hidden items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 shadow-md lg:flex">
        <span className="text-xs text-slate-500">AI</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
          A
        </span>
      </div>
    </section>
  );
}

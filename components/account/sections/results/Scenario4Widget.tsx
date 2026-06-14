"use client";

import { Icon } from "@iconify/react";
import { formatCompact } from "@/utils/formatCompact";
import { useGetScenario4Output } from "@/hooks/scenario/useScenario4";
import { useLocale, useTranslations } from "@/i18n/client";

export default function Scenario4Widget() {
  const t = useTranslations("Scenario");
  const locale = useLocale();
  const { data, isLoading } = useGetScenario4Output();

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Icon icon="mdi:loading" className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <Icon icon="mingcute:pig-money-line" className="h-8 w-8 opacity-30" aria-hidden="true" />
        <p className="text-sm">{t("outputs.empty", { id: "04" })}</p>
      </div>
    );
  }

  const stats = [
    {
      label: t("outputs.ffpAge"),
      value: data.ffpAge == null ? "-" : String(data.ffpAge),
    },
    {
      label: t("outputs.annualSpending"),
      value: formatCompact(data.inputFfpAnnualSpending, locale),
    },
    {
      label: t("outputs.requiredWealthAtFfp"),
      value: formatCompact(data.requiredWealthAtFFPAge, locale),
    },
    {
      label: t("outputs.requiredAnnualSaving"),
      value: formatCompact(data.requiredAnnualSaving, locale),
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-between rounded-xl bg-primary-soft px-5 py-3"
        >
          <div className="flex items-center gap-3">
            {/* <Icon icon={stat.icon} className="h-5 w-5 text-primary" aria-hidden="true" /> */}
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <span className="text-lg font-bold text-primary">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

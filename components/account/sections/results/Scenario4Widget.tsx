"use client";

import { Icon } from "@iconify/react";
import { formatCompact } from "@/utils/formatCompact";
import { useGetScenario4Output } from "@/hooks/scenario/useScenario4";

export default function Scenario4Widget() {
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
        <p className="text-sm">No result yet — try Scenario 04 on the home page.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Required annual saving",
      value: formatCompact(data.requiredAnnualSaving),
      icon: "mingcute:pig-money-line",
    },
    {
      label: "FFP age",
      value: String(data.ffpAge),
      icon: "mdi:calendar-check-outline",
    },
    {
      label: "Required wealth at FFP",
      value: formatCompact(data.requiredWealthAtFFPAge),
      icon: "mdi:bank-outline",
    },
  ];

  return (
    <div className="space-y-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-between rounded-xl bg-primary-soft px-5 py-3"
        >
          <div className="flex items-center gap-3">
            <Icon icon={stat.icon} className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <span className="text-lg font-bold text-primary">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { Icon } from "@iconify/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  SubTitle,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCompact, formatCompactRange } from "@/utils/formatCompact";
import { useGetScenario3Output } from "@/hooks/scenario/useScenario3";
import { useLocale, useTranslations } from "@/i18n/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  SubTitle,
);

type ChartLabels = {
  title: string;
  subtitle: string;
  age: string;
  wealth: string;
};

function createOptions(
  locale: "en" | "vi",
  chartLabels: ChartLabels,
): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { usePointStyle: true, boxWidth: 8 },
      },
      title: {
        display: true,
        text: chartLabels.title,
        color: "#374151",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 10 },
      },
      subtitle: {
        display: true,
        text: chartLabels.subtitle,
        color: "#6b7280",
        font: { size: 12 },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${formatCompact(ctx.parsed.y ?? 0, locale)}`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: chartLabels.age } },
      y: {
        title: { display: true, text: chartLabels.wealth },
        min: 0,
        ticks: { callback: (v) => formatCompact(Number(v), locale) },
      },
    },
  };
}

export default function Scenario3Widget() {
  const t = useTranslations("Scenario");
  const locale = useLocale();
  const { data, isLoading } = useGetScenario3Output();
  const chartOptions = createOptions(locale, {
    title: t("charts.cashflowTitle"),
    subtitle: t("charts.cashflowRangeSubtitle"),
    age: t("charts.age"),
    wealth: t("charts.wealth"),
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Icon icon="mdi:loading" className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (!data || !data.retirementCashflow?.length) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <Icon icon="icon-park-outline:calculator" className="h-8 w-8 opacity-30" aria-hidden="true" />
        <p className="text-sm">{t("outputs.empty", { id: "03" })}</p>
      </div>
    );
  }

  const labels = data.retirementCashflow.map((p) => String(p.age));

  const chartData = {
    labels,
    datasets: [
      {
        label: t("charts.retirementWealthLow"),
        data: data.retirementCashflow.map(
          (p) => p.wealthLow ?? p.wealthExpected ?? p.wealth ?? 0,
        ),
        borderColor: "#ef4444",
        backgroundColor: "#ef444420",
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: t("charts.retirementWealthExpected"),
        data: data.retirementCashflow.map(
          (p) => p.wealthExpected ?? p.wealth ?? 0,
        ),
        borderColor: "#6366f1",
        backgroundColor: "#6366f120",
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: t("charts.retirementWealthHigh"),
        data: data.retirementCashflow.map(
          (p) => p.wealthHigh ?? p.wealthExpected ?? p.wealth ?? 0,
        ),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e20",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-primary-soft px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{t("outputs.targetFfpAge")}</p>
          <p className="mt-0.5 text-xl font-bold text-primary">
            {data.inputFfpAge ?? "-"}
          </p>
        </div>
        <div className="rounded-xl bg-primary-soft px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{t("outputs.availableAnnualSpending")}</p>
          <p className="mt-0.5 text-xl font-bold text-primary">
            {formatCompactRange(
              data.outputFfpAnnualSpendingLow ?? data.outputFfpAnnualSpending,
              data.outputFfpAnnualSpendingHigh ?? data.outputFfpAnnualSpending,
              locale,
            )}
          </p>
        </div>
        <div className="rounded-xl bg-primary-soft px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{t("outputs.availableMonthlySpending")}</p>
          <p className="mt-0.5 text-xl font-bold text-primary">
            {formatCompactRange(
              data.outputFfpMonthlySpendingLow ??
                data.outputFfpMonthlySpending,
              data.outputFfpMonthlySpendingHigh ??
                data.outputFfpMonthlySpending,
              locale,
            )}
          </p>
        </div>
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

"use client";

import { Icon } from "@iconify/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  SubTitle,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCompact } from "@/utils/formatCompact";
import { useGetScenario1Output } from "@/hooks/scenario/useScenario1";
import { useLocale, useTranslations } from "@/i18n/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
        ticks: { callback: (v) => formatCompact(Number(v), locale) },
      },
    },
  };
}

export default function Scenario1Widget() {
  const t = useTranslations("Scenario");
  const locale = useLocale();
  const { data, isLoading } = useGetScenario1Output();
  const chartOptions = createOptions(locale, {
    title: t("charts.goalTitle"),
    subtitle: t("charts.wealthRangeSubtitle"),
    age: t("charts.age"),
    wealth: t("charts.wealth"),
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Icon
          icon="mdi:loading"
          className="h-6 w-6 animate-spin text-primary"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!data || !data.wealthProjection?.length) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <Icon
          icon="mingcute:target-line"
          className="h-8 w-8 opacity-30"
          aria-hidden="true"
        />
        <p className="text-sm">{t("outputs.empty", { id: "01" })}</p>
      </div>
    );
  }

  const achievable = data.outputLowIsAchievable;
  const summaryToneClass = achievable
    ? "bg-green-50 text-green-700"
    : data.outputHighIsAchievable
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-600";
  const labels = data.wealthProjection.map((p) => String(p.age));
  const lowData = data.wealthProjection.map((p) => p.wealthLow);
  const expectedData = data.wealthProjection.map((p) => p.wealthExpected);
  const highData = data.wealthProjection.map((p) => p.wealthHigh);
  const summaryTone = data.outputLowIsAchievable
    ? t("outputs.conservativeAchievable")
    : data.outputHighIsAchievable
      ? t("outputs.optimisticAchievable")
      : t("outputs.notYet");

  const chartData = {
    labels,
    datasets: [
      {
        label: t("charts.projectedWealthLow"),
        data: lowData,
        borderColor: "#ef4444",
        backgroundColor: "#ef444420",
        pointRadius: 3,
        tension: 0.3,
      },
      {
        label: t("charts.projectedWealth"),
        data: expectedData,
        borderColor: "#6366f1",
        backgroundColor: "#6366f120",
        pointRadius: 3,
        tension: 0.3,
      },
      {
        label: t("charts.projectedWealthHigh"),
        data: highData,
        borderColor: "#22c55e",
        backgroundColor: "#22c55e20",
        pointRadius: 3,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl bg-primary-soft px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {t("outputs.ffpAge")}
            </span>
          </div>
          <span className="text-lg font-bold text-primary">
            {data.inputFfpAge ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-primary-soft px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {t("outputs.annualSpending")}
            </span>
          </div>
          <span className="text-lg font-bold text-primary">
            {formatCompact(data.inputFfpAnnualSpending, locale)}
          </span>
        </div>
      </div>

      <div
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm font-semibold ${summaryToneClass}`}
      >
        <Icon
          icon={
            achievable
              ? "mdi:check-circle"
              : data.outputHighIsAchievable
                ? "mdi:alert-circle"
                : "mdi:close-circle"
          }
          className="h-4 w-4"
          aria-hidden="true"
        />
        {summaryTone}
      </div>

      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

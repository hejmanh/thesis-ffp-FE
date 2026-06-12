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
import { formatCompact } from "@/utils/formatCompact";
import { useGetScenario3Output } from "@/hooks/scenario/useScenario3";
import { useTranslations } from "@/i18n/client";

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

const OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    title: {
        display: true,
        text: "Retirement Cashflow Projection",
        color: "#374151",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 10 },
    },
    subtitle: {
        display: true,
        text: "Projects the decline of retirement wealth over time based on your spending plan.",
        color: "#6b7280",
        font: { size: 12 },
        padding: { bottom: 20 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `Wealth: ${formatCompact(ctx.parsed.y ?? 0)}`,
      },
    },
  },
  scales: {
    x: { title: { display: true, text: "Age" } },
    y: {
      title: { display: true, text: "Wealth" },
      min: 0,
      ticks: { callback: (v) => formatCompact(Number(v)) },
    },
  },
};

export default function Scenario3Widget() {
  const t = useTranslations("Scenario");
  const { data, isLoading } = useGetScenario3Output();

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
  const wealthData = data.retirementCashflow.map((p) => p.wealth);

  const chartData = {
    labels,
    datasets: [
      {
        label: t("charts.wealth"),
        data: wealthData,
        borderColor: "#6366f1",
        backgroundColor: "#6366f130",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-primary-soft px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{t("outputs.ffpAge")}</p>
          <p className="mt-0.5 text-xl font-bold text-primary">
            {data.inputFfpAge ?? "-"}
          </p>
        </div>
        <div className="rounded-xl bg-primary-soft px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{t("outputs.annualSpending")}</p>
          <p className="mt-0.5 text-xl font-bold text-primary">
            {formatCompact(data.outputFfpAnnualSpending)}
          </p>
        </div>
        <div className="rounded-xl bg-primary-soft px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">{t("outputs.monthlySpending")}</p>
          <p className="mt-0.5 text-xl font-bold text-primary">
            {formatCompact(data.outputFfpMonthlySpending)}
          </p>
        </div>
      </div>
      <Line data={chartData} options={OPTIONS} />
    </div>
  );
}

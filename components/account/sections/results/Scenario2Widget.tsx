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
import { useGetScenario2Output } from "@/hooks/scenario/useScenario2";
import { useTranslations } from "@/i18n/client";

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

const OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
    title: {
        display: true,
        text: "Financial Freedom Point (FFP) Age Projection",
        color: "#374151",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 10 },
    },
    subtitle: {
        display: true,
        text: "Compare projected wealth against the age-specific wealth requirement to identify when financial freedom is achieved.",
        color: "#6b7280",
        font: { size: 12 },
        padding: { bottom: 20 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) =>
          `${ctx.dataset.label}: ${formatCompact(ctx.parsed.y ?? 0)}`,
      },
    },
  },
  scales: {
    x: { title: { display: true, text: "Age" } },
    y: {
      title: { display: true, text: "Wealth" },
      ticks: { callback: (v) => formatCompact(Number(v)) },
    },
  },
};

export default function Scenario2Widget() {
  const t = useTranslations("Scenario");
  const { data, isLoading } = useGetScenario2Output();

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Icon icon="mdi:loading" className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (!data || !data.wealthProjection?.length) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <Icon icon="mingcute:calendar-2-line" className="h-8 w-8 opacity-30" aria-hidden="true" />
        <p className="text-sm">{t("outputs.empty", { id: "02" })}</p>
      </div>
    );
  }

  const labels = data.wealthProjection.map((p) => String(p.age));
  const ffpAge = data.outputFfpAge;

  // Find the intersection point index (where wealth first >= requiredWealth)
  const intersectionIdx = data.wealthProjection.findIndex(
    (p) => p.wealth >= p.requiredWealth,
  );

  const wealthData = data.wealthProjection.map((p) => p.wealth);
  const requiredData = data.wealthProjection.map((p) => p.requiredWealth);

  // Highlight intersection point on the wealth line
  const pointRadius = data.wealthProjection.map((_, i) =>
    i === intersectionIdx ? 7 : 3,
  );
  const pointBackgroundColor = data.wealthProjection.map((_, i) =>
    i === intersectionIdx ? "#22c55e" : "#6366f1",
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: t("charts.projectedWealth"),
        data: wealthData,
        borderColor: "#6366f1",
        backgroundColor: "#6366f120",
        pointRadius,
        pointBackgroundColor,
        tension: 0.3,
      },
      {
        label: t("charts.ageSpecificRequiredWealth"),
        data: requiredData,
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b20",
        borderDash: [6, 3],
        pointRadius: 3,
        tension: 0,
      },
    ],
  };

  return (
    <div className="space-y-3">
      {ffpAge > 0 && (
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
          <Icon icon="mdi:flag-checkered" className="h-4 w-4" aria-hidden="true" />
          {t("outputs.ffpAchievedAtAge", { age: ffpAge })}
        </div>
      )}
      <Line data={chartData} options={OPTIONS} />
    </div>
  );
}

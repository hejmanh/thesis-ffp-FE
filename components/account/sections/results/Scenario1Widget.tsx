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
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCompact } from "@/utils/formatCompact";
import { useGetScenario1Output } from "@/hooks/scenario/useScenario1";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
);

const OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
    title: {
        display: true,
        text: "FFP Goal Achievement Projection",
        color: "#374151",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 10 },
    },
    subtitle: {
        display: true,
        text: "Compare projected wealth against the required wealth target at your selected FFP age.",
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

export default function Scenario1Widget() {
  const { data, isLoading } = useGetScenario1Output();

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
        <Icon icon="mingcute:target-line" className="h-8 w-8 opacity-30" aria-hidden="true" />
        <p className="text-sm">No result yet — try Scenario 01 on the home page.</p>
      </div>
    );
  }

  const achievable = data.outputIsAchievable;
  const labels = data.wealthProjection.map((p) => String(p.age));
  const wealthData = data.wealthProjection.map((p) => p.wealth);
  const requiredData = data.wealthProjection.map(() => data.requiredWealthAtFFPAge);

  // Find first point where wealth reaches/exceeds required wealth
  const intersectionIdx = data.wealthProjection.findIndex(
    (p) => p.wealth >= data.requiredWealthAtFFPAge,
  );

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
        label: "Projected Wealth",
        data: wealthData,
        borderColor: "#6366f1",
        backgroundColor: "#6366f120",
        pointRadius,
        pointBackgroundColor,
        tension: 0.3,
      },
      {
        label: "FFP Target Wealth",
        data: requiredData,
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b20",
        borderDash: [6, 3],
        pointRadius: 0,
        tension: 0,
      },
    ],
  };

  return (
    <div className="space-y-3">
      <div
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm font-semibold ${
          achievable
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-600"
        }`}
      >
        <Icon
          icon={achievable ? "mdi:check-circle" : "mdi:close-circle"}
          className="h-4 w-4"
          aria-hidden="true"
        />
        {achievable ? "Yes, the goal is achievable" : "Not yet — adjust your plan"}
      </div>
      <Line data={chartData} options={OPTIONS} />
    </div>
  );
}

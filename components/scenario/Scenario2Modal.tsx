"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCompact } from "@/utils/formatCompact";
import Button from "@/components/common/Button";
import Link from "next/link";
import FormField from "@/components/common/FormField";
import ScenarioInputModal from "@/components/scenario/ScenarioInputModal";
import {
  useGetScenario2Input,
  useGetScenario2Output,
  useCreateScenario2Input,
  useUpdateScenario2Input,
} from "@/hooks/scenario/useScenario2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const CHART_OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
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

interface Scenario2ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scenario2Modal({ isOpen, onClose }: Scenario2ModalProps) {
  const inputQuery = useGetScenario2Input();
  const outputQuery = useGetScenario2Output();
  const createMutation = useCreateScenario2Input();
  const updateMutation = useUpdateScenario2Input();

  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [inputFfpAnnualSpending, setInputFfpAnnualSpending] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasExistingInput = !!inputQuery.data;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (inputQuery.data) {
      setLifeExpectancy(String(inputQuery.data.lifeExpectancy));
      setInputFfpAnnualSpending(String(inputQuery.data.inputFfpAnnualSpending));
    }
  }, [inputQuery.data]);

  useEffect(() => {
    if (isOpen) setSubmitError(null);
  }, [isOpen]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      lifeExpectancy: Number(lifeExpectancy),
      inputFfpAnnualSpending: Number(inputFfpAnnualSpending),
    };

    const mutation = hasExistingInput ? updateMutation : createMutation;
    const result = await mutation.mutateAsync(payload).catch((err: unknown) => {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    });

    if (result?.success) {
      outputQuery.refetch();
    }
  }

  const output = outputQuery.data;

  return (
    <ScenarioInputModal
      isOpen={isOpen}
      onClose={onClose}
      title="When will I reach FFP?"
      scenarioId="02"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Life Expectancy (years)"
          isRequired
          inputProps={{
            type: "number",
            min: 1,
            placeholder: "e.g. 85",
            value: lifeExpectancy,
            onChange: (e) => setLifeExpectancy(e.target.value),
            required: true,
          }}
        />
        <FormField
          label="Annual Spending at FFP"
          isRequired
          inputProps={{
            type: "number",
            min: 0,
            placeholder: "e.g. 24000",
            value: inputFfpAnnualSpending,
            onChange: (e) => setInputFfpAnnualSpending(e.target.value),
            required: true,
          }}
        />

        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" aria-hidden="true" />
              Calculating…
            </span>
          ) : hasExistingInput ? (
            "Recalculate"
          ) : (
            "Calculate"
          )}
        </Button>
      </form>

      {/* Inline result */}
      {output !== null && output !== undefined && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="mb-3 text-sm font-medium text-slate-500">Result</p>

          {/* FFP age badge */}
          {output.outputFfpAge > 0 && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              <Icon icon="mdi:flag-checkered" className="h-4 w-4" aria-hidden="true" />
              FFP achieved at age {output.outputFfpAge}
            </div>
          )}

          {/* Two-line wealth chart */}
          {output.wealthProjection?.length > 0 && (() => {
            const labels = output.wealthProjection.map((p) => String(p.age));
            const intersectionIdx = output.wealthProjection.findIndex(
              (p) => p.wealth >= p.requiredWealth,
            );
            const pointRadius = output.wealthProjection.map((_, i) =>
              i === intersectionIdx ? 7 : 3,
            );
            const pointBackgroundColor = output.wealthProjection.map((_, i) =>
              i === intersectionIdx ? "#22c55e" : "#6366f1",
            );
            const chartData = {
              labels,
              datasets: [
                {
                  label: "Projected Wealth",
                  data: output.wealthProjection.map((p) => p.wealth),
                  borderColor: "#6366f1",
                  backgroundColor: "#6366f120",
                  pointRadius,
                  pointBackgroundColor,
                  tension: 0.3,
                },
                {
                  label: "Required Wealth",
                  data: output.wealthProjection.map((p) => p.requiredWealth),
                  borderColor: "#f59e0b",
                  backgroundColor: "#f59e0b20",
                  borderDash: [6, 3],
                  pointRadius: 3,
                  tension: 0,
                },
              ],
            };
            return <Line data={chartData} options={CHART_OPTIONS} />;
          })()}
          <p className="mt-3 text-xs text-muted-foreground">
            See detailed stats in your{" "}
            <Link href="/profile?tab=results" className="text-primary hover:underline">
            Results</Link> tab on the profile page.
          </p>

          {outputQuery.isFetching && (
            <p className="mt-2 text-xs text-muted-foreground">Updating…</p>
          )}
        </div>
      )}
    </ScenarioInputModal>
  );
}

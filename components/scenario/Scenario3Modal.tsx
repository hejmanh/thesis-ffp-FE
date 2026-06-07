"use client";

import { type FormEvent, useEffect, useState } from "react";
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
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCompact } from "@/utils/formatCompact";
import Button from "@/components/common/Button";
import Link from "next/link";
import FormField from "@/components/common/FormField";
import LifeExpectancyField from "@/components/scenario/LifeExpectancyField";
import ScenarioInputModal from "@/components/scenario/ScenarioInputModal";
import { useLifeExpectancyOptions } from "@/hooks/scenario/useLifeExpectancyOptions";
import {
  useGetScenario3Input,
  useGetScenario3Output,
  useCreateScenario3Input,
  useUpdateScenario3Input,
} from "@/hooks/scenario/useScenario3";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
);

const CHART_OPTIONS: ChartOptions<"line"> = {
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

interface Scenario3ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scenario3Modal({ isOpen, onClose }: Scenario3ModalProps) {
  const inputQuery = useGetScenario3Input();
  const outputQuery = useGetScenario3Output();
  const createMutation = useCreateScenario3Input();
  const updateMutation = useUpdateScenario3Input();
  const { defaultValue: defaultLifeExpectancy } = useLifeExpectancyOptions();

  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [inputFfpAge, setInputFfpAge] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (inputQuery.data) {
      setLifeExpectancy(String(inputQuery.data.lifeExpectancy));
      setInputFfpAge(String(inputQuery.data.inputFfpAge));
    } else if (defaultLifeExpectancy) {
      setLifeExpectancy(defaultLifeExpectancy);
    }
  }, [inputQuery.data, defaultLifeExpectancy]);

  useEffect(() => {
    if (isOpen) setSubmitError(null);
  }, [isOpen]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      lifeExpectancy: Number(lifeExpectancy),
      inputFfpAge: Number(inputFfpAge),
    };

    const mutation = inputQuery.data ? updateMutation : createMutation;
    await mutation.mutateAsync(payload).catch((err: unknown) => {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    });
  }

  const output = outputQuery.data;

  return (
    <ScenarioInputModal
      isOpen={isOpen}
      onClose={onClose}
      title="How much can I spend at FFP?"
      scenarioId="03"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <LifeExpectancyField
          value={lifeExpectancy}
          onChange={setLifeExpectancy}
        />
        <FormField
          label="Target FFP Age"
          isRequired
          inputProps={{
            type: "number",
            min: 1,
            placeholder: "e.g. 55",
            value: inputFfpAge,
            onChange: (e) => setInputFfpAge(e.target.value),
            required: true,
          }}
        />

        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || inputQuery.isLoading || !lifeExpectancy}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" aria-hidden="true" />
              Calculating…
            </span>
          ) : inputQuery.data ? (
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

          {/* Spending stat cards */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary-soft px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">Annual spending</p>
              <p className="mt-1 text-xl font-bold text-primary">
                {formatCompact(output.outputFfpAnnualSpending)}
              </p>
            </div>
            <div className="rounded-2xl bg-primary-soft px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">Monthly spending</p>
              <p className="mt-1 text-xl font-bold text-primary">
                {formatCompact(output.outputFfpMonthlySpending)}
              </p>
            </div>
          </div>

          {/* Depletion chart */}
          {output.retirementCashflow?.length > 0 && (
            <Line
              data={{
                labels: output.retirementCashflow.map((p) => String(p.age)),
                datasets: [
                  {
                    label: "Wealth",
                    data: output.retirementCashflow.map((p) => p.wealth),
                    borderColor: "#6366f1",
                    backgroundColor: "#6366f130",
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                  },
                ],
              }}
              options={CHART_OPTIONS}
            />
          )}
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

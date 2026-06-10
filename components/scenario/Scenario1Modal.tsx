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
  SubTitle,
  type ChartOptions,
  Title,
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
  useGetScenario1Input,
  useGetScenario1Output,
  useCreateScenario1Input,
  useUpdateScenario1Input,
} from "@/hooks/scenario/useScenario1";
import { useLocalizedPath, useTranslations } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

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

const CHART_OPTIONS: ChartOptions<"line"> = {
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

interface Scenario1ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scenario1Modal({ isOpen, onClose }: Scenario1ModalProps) {
  const t = useTranslations("Scenario");
  const fields = useTranslations("Fields");
  const common = useTranslations("Common");
  const home = useTranslations("Home.features");
  const getApiErrorMessage = useApiErrorMessage();
  const toLocalizedPath = useLocalizedPath();
  const inputQuery = useGetScenario1Input();
  const outputQuery = useGetScenario1Output();
  const createMutation = useCreateScenario1Input();
  const updateMutation = useUpdateScenario1Input();
  const { defaultValue: defaultLifeExpectancy } = useLifeExpectancyOptions();

  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [inputFfpAge, setInputFfpAge] = useState("");
  const [inputFfpAnnualSpending, setInputFfpAnnualSpending] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Pre-populate fields when existing input loads or default from profile
  useEffect(() => {
    if (inputQuery.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLifeExpectancy(String(inputQuery.data.lifeExpectancy));
      setInputFfpAge(String(inputQuery.data.inputFfpAge));
      setInputFfpAnnualSpending(String(inputQuery.data.inputFfpAnnualSpending));
    } else if (defaultLifeExpectancy) {
      setLifeExpectancy(defaultLifeExpectancy);
    }
  }, [inputQuery.data, defaultLifeExpectancy]);

  // Reset on modal open
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitError(null);
    }
  }, [isOpen]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      lifeExpectancy: Number(lifeExpectancy),
      inputFfpAge: Number(inputFfpAge),
      inputFfpAnnualSpending: Number(inputFfpAnnualSpending),
    };

    const mutation = inputQuery.data ? updateMutation : createMutation;
    await mutation.mutateAsync(payload).catch((err: unknown) => {
      setSubmitError(getApiErrorMessage(err, t("fallbackError")));
      return null;
    });
  }

  const output = outputQuery.data;

  return (
    <ScenarioInputModal
      isOpen={isOpen}
      onClose={onClose}
      title={home("reachGoal.title")}
      scenarioId="01"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <LifeExpectancyField
          value={lifeExpectancy}
          onChange={setLifeExpectancy}
        />
        <FormField
          label={fields("targetFfpAge")}
          isRequired
          inputProps={{
            type: "number",
            min: 1,
            placeholder: fields("placeholderAge55"),
            value: inputFfpAge,
            onChange: (e) => setInputFfpAge(e.target.value),
            required: true,
          }}
        />
        <FormField
          label={fields("annualSpendingAtFfp")}
          isRequired
          inputProps={{
            type: "number",
            min: 0,
            placeholder: fields("placeholderAnnualSpending"),
            value: inputFfpAnnualSpending,
            onChange: (e) => setInputFfpAnnualSpending(e.target.value),
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
              {common("calculating")}
            </span>
          ) : inputQuery.data ? (
            common("recalculate")
          ) : (
            common("calculate")
          )}
        </Button>
      </form>

      {/* Inline result */}
      {output !== null && output !== undefined && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="mb-3 text-sm font-medium text-slate-500">{t("result")}</p>

          {/* Yes / No badge */}
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
              output.outputIsAchievable
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            <Icon
              icon={output.outputIsAchievable ? "mdi:check-circle" : "mdi:close-circle"}
              className="h-4 w-4"
              aria-hidden="true"
            />
            {output.outputIsAchievable
              ? t("outputs.yesAchievableModal")
              : t("outputs.notYet")}
          </div>

          {/* Wealth vs Required wealth chart */}
          {output.wealthProjection?.length > 0 && (() => {
            const labels = output.wealthProjection.map((p) => String(p.age));
            const wealthData = output.wealthProjection.map((p) => p.wealth);
            const requiredData = output.wealthProjection.map(
              () => output.requiredWealthAtFFPAge,
            );
            const intersectionIdx = output.wealthProjection.findIndex(
              (p) => p.wealth >= output.requiredWealthAtFFPAge,
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
                  label: t("charts.projectedWealth"),
                  data: wealthData,
                  borderColor: "#6366f1",
                  backgroundColor: "#6366f120",
                  pointRadius,
                  pointBackgroundColor,
                  tension: 0.3,
                },
                {
                  label: t("charts.requiredWealth"),
                  data: requiredData,
                  borderColor: "#f59e0b",
                  borderDash: [6, 3],
                  pointRadius: 0,
                  tension: 0,
                },
              ],
            };
            return <Line data={chartData} options={CHART_OPTIONS} />;
          })()}
          <p className="mt-3 text-xs text-muted-foreground">
            <Link href={toLocalizedPath("/profile?tab=results")} className="text-primary hover:underline">
              {t("detailsLink", { tab: common("results") })}
            </Link>
          </p>

          {outputQuery.isFetching && (
            <p className="mt-2 text-xs text-muted-foreground">{t("updating")}</p>
          )}
        </div>
      )}
    </ScenarioInputModal>
  );
}

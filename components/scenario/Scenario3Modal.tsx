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
  SubTitle,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCompact, formatCompactRange } from "@/utils/formatCompact";
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
import { useLocale, useLocalizedPath, useTranslations, useLocaleRouter } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

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

function createChartOptions(
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

interface Scenario3ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scenario3Modal({ isOpen, onClose }: Scenario3ModalProps) {
  const t = useTranslations("Scenario");
  const fields = useTranslations("Fields");
  const common = useTranslations("Common");
  const home = useTranslations("Home.features");
  const getApiErrorMessage = useApiErrorMessage();
  const locale = useLocale();
  const toLocalizedPath = useLocalizedPath();
  const chartOptions = createChartOptions(locale, {
    title: t("charts.cashflowTitle"),
    subtitle: t("charts.cashflowRangeSubtitle"),
    age: t("charts.age"),
    wealth: t("charts.wealth"),
  });
  const inputQuery = useGetScenario3Input();
  const outputQuery = useGetScenario3Output();
  const createMutation = useCreateScenario3Input();
  const updateMutation = useUpdateScenario3Input();
  const { defaultValue: defaultLifeExpectancy } = useLifeExpectancyOptions();
  const router = useLocaleRouter();

  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [inputFfpAge, setInputFfpAge] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (inputQuery.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLifeExpectancy(String(inputQuery.data.lifeExpectancy));
      setInputFfpAge(String(inputQuery.data.inputFfpAge));
    } else if (defaultLifeExpectancy) {
      setLifeExpectancy(defaultLifeExpectancy);
    }
  }, [inputQuery.data, defaultLifeExpectancy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setSubmitError(getApiErrorMessage(err, t("fallbackError")));
      return null;
    });
  }

  const output = outputQuery.data;

  return (
    <ScenarioInputModal
      isOpen={isOpen}
      onClose={onClose}
      title={home("spending.title")}
      scenarioId="03"
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
            min: 1,
            placeholder: fields("placeholderAge55"),
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
          <p className="mb-2 text-sm font-bold text-slate-500">{t("result")}</p>
          <p className="mb-4 text-sm text-slate-600">
            {t("incompleteStageNotice")}{" "}
            <button
              type="button"
              onClick={() => router.push("/profile?tab=financial")}
              className="font-semibold text-primary underline hover:text-primary-600 transition"
            >
              {t("profilePage")}
            </button>
          </p>

          {/* Spending stat cards */}
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-soft px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">{t("outputs.targetFfpAge")}</p>
              <p className="mt-1 text-xl font-bold text-primary">
                {output.inputFfpAge ?? "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-primary-soft px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">{t("outputs.availableAnnualSpending")}</p>
              <p className="mt-1 text-xl font-bold text-primary">
                {formatCompactRange(
                  output.outputFfpAnnualSpendingLow ??
                    output.outputFfpAnnualSpending,
                  output.outputFfpAnnualSpendingHigh ??
                    output.outputFfpAnnualSpending,
                  locale,
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-primary-soft px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">{t("outputs.availableMonthlySpending")}</p>
              <p className="mt-1 text-xl font-bold text-primary">
                {formatCompactRange(
                  output.outputFfpMonthlySpendingLow ??
                    output.outputFfpMonthlySpending,
                  output.outputFfpMonthlySpendingHigh ??
                    output.outputFfpMonthlySpending,
                  locale,
                )}
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
                    label: t("charts.retirementWealthLow"),
                    data: output.retirementCashflow.map(
                      (p) => p.wealthLow ?? p.wealthExpected ?? p.wealth ?? 0,
                    ),
                    borderColor: "#ef4444",
                    backgroundColor: "#ef444420",
                    tension: 0.3,
                    pointRadius: 4,
                  },
                  {
                    label: t("charts.retirementWealthExpected"),
                    data: output.retirementCashflow.map(
                      (p) => p.wealthExpected ?? p.wealth ?? 0,
                    ),
                    borderColor: "#6366f1",
                    backgroundColor: "#6366f120",
                    tension: 0.3,
                    pointRadius: 4,
                  },
                  {
                    label: t("charts.retirementWealthHigh"),
                    data: output.retirementCashflow.map(
                      (p) => p.wealthHigh ?? p.wealthExpected ?? p.wealth ?? 0,
                    ),
                    borderColor: "#22c55e",
                    backgroundColor: "#22c55e20",
                    tension: 0.3,
                    pointRadius: 4,
                  },
                ],
              }}
              options={chartOptions}
            />
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {t("viewDetailedStats")} {" "}
            <Link href={toLocalizedPath("/profile?tab=results")} className="text-primary hover:underline">
              {t("profilePage")}
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

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
import {
  useLocale,
  useLocalizedPath,
  useTranslations,
  useLocaleRouter,
} from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";
import { useUserContext } from "@/providers/UserContextProvider";
import { useFinancialPlanningReferences } from "@/hooks/reference/useFinancialPlanningReferences";
import { resolveCurrencyCode } from "@/utils/referenceOptions";

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

interface Scenario1ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scenario1Modal({
  isOpen,
  onClose,
}: Scenario1ModalProps) {
  const t = useTranslations("Scenario");
  const fields = useTranslations("Fields");
  const common = useTranslations("Common");
  const home = useTranslations("Home.features");
  const getApiErrorMessage = useApiErrorMessage();
  const locale = useLocale();
  const toLocalizedPath = useLocalizedPath();
  const chartOptions = createChartOptions(locale, {
    title: t("charts.goalTitle"),
    subtitle: t("charts.wealthRangeSubtitle"),
    age: t("charts.age"),
    wealth: t("charts.wealth"),
  });
  const inputQuery = useGetScenario1Input();
  const outputQuery = useGetScenario1Output();
  const createMutation = useCreateScenario1Input();
  const updateMutation = useUpdateScenario1Input();
  const { defaultValue: defaultLifeExpectancy } = useLifeExpectancyOptions();
  const { data: userData } = useUserContext();
  const { currencies } = useFinancialPlanningReferences();
  const currencyCode = resolveCurrencyCode(
    currencies,
    userData?.preferredCurrencyId,
  );
  const router = useLocaleRouter();

  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [inputFfpAge, setInputFfpAge] = useState("");
  const [inputFfpAnnualSpending, setInputFfpAnnualSpending] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
        <LifeExpectancyField value={lifeExpectancy} onChange={setLifeExpectancy} />
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
        <FormField
          label={fields("annualSpendingAtFfp")}
          isRequired
          inputClassName="h-11 px-3 pr-14"
          suffix={currencyCode}
          inputProps={{
            min: 0,
            placeholder: fields("placeholderAnnualSpending"),
            value: inputFfpAnnualSpending,
            onChange: (e) => setInputFfpAnnualSpending(e.target.value),
            required: true,
          }}
        />

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || inputQuery.isLoading || !lifeExpectancy}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Icon
                icon="mdi:loading"
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              {common("calculating")}
            </span>
          ) : inputQuery.data ? (
            common("recalculate")
          ) : (
            common("calculate")
          )}
        </Button>
      </form>

      {output !== null && output !== undefined && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="mb-2 text-sm font-bold text-slate-500">{t("result")}</p>
          <p className="mb-4 text-sm text-slate-600">
            {t("incompleteStageNotice")}{" "}
            <button
              type="button"
              onClick={() => router.push("/profile?tab=financial")}
              className="font-semibold text-primary underline transition hover:text-primary-600"
            >
              {t("profilePage")}
            </button>
          </p>

          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
              output.outputLowIsAchievable
                ? "bg-green-50 text-green-700"
                : output.outputHighIsAchievable
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-600"
            }`}
          >
            <Icon
              icon={
                output.outputLowIsAchievable
                  ? "mdi:check-circle"
                  : output.outputHighIsAchievable
                    ? "mdi:alert-circle"
                    : "mdi:close-circle"
              }
              className="h-4 w-4"
              aria-hidden="true"
            />
            {output.outputLowIsAchievable
              ? t("outputs.conservativeAchievable")
              : output.outputHighIsAchievable
                ? t("outputs.optimisticAchievable")
                : t("outputs.notYet")}
          </div>

          {output.wealthProjection?.length > 0 && (() => {
            const labels = output.wealthProjection.map((p) => String(p.age));
            const lowData = output.wealthProjection.map((p) => p.wealthLow);
            const expectedData = output.wealthProjection.map(
              (p) => p.wealthExpected,
            );
            const highData = output.wealthProjection.map((p) => p.wealthHigh);
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
            return <Line data={chartData} options={chartOptions} />;
          })()}

          <p className="mt-3 text-xs text-muted-foreground">
            {t("viewDetailedStats")} {" "}
            <Link
              href={toLocalizedPath("/profile?tab=results")}
              className="text-primary hover:underline"
            >
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

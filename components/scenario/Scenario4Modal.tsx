"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { formatCompact } from "@/utils/formatCompact";
import Button from "@/components/common/Button";
import Link from "next/link";
import FormField from "@/components/common/FormField";
import LifeExpectancyField from "@/components/scenario/LifeExpectancyField";
import ScenarioInputModal from "@/components/scenario/ScenarioInputModal";
import { useLifeExpectancyOptions } from "@/hooks/scenario/useLifeExpectancyOptions";
import {
  useGetScenario4Input,
  useGetScenario4Output,
  useCreateScenario4Input,
  useUpdateScenario4Input,
} from "@/hooks/scenario/useScenario4";
import { useLocalizedPath, useTranslations } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

interface Scenario4ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scenario4Modal({ isOpen, onClose }: Scenario4ModalProps) {
  const t = useTranslations("Scenario");
  const fields = useTranslations("Fields");
  const common = useTranslations("Common");
  const home = useTranslations("Home.features");
  const getApiErrorMessage = useApiErrorMessage();
  const toLocalizedPath = useLocalizedPath();
  const inputQuery = useGetScenario4Input();
  const outputQuery = useGetScenario4Output();
  const createMutation = useCreateScenario4Input();
  const updateMutation = useUpdateScenario4Input();
  const { defaultValue: defaultLifeExpectancy } = useLifeExpectancyOptions();

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setSubmitError(null);
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
      title={home("savings.title")}
      scenarioId="04"
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
            placeholder: fields("placeholderAge60"),
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
            placeholder: fields("placeholderAnnualSpendingSmall"),
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
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-primary-soft px-5 py-3">
              <span className="text-sm text-muted-foreground">{t("outputs.requiredAnnualSaving")}</span>
              <span className="text-xl font-bold text-primary">
                {formatCompact(output.requiredAnnualSaving)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-primary-soft px-5 py-3">
              <span className="text-sm text-muted-foreground">{t("outputs.ffpAge")}</span>
              <span className="text-xl font-bold text-primary">{output.ffpAge ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-primary-soft px-5 py-3">
              <span className="text-sm text-muted-foreground">{t("outputs.annualSpending")}</span>
              <span className="text-xl font-bold text-primary">
                {formatCompact(output.inputFfpAnnualSpending)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-primary-soft px-5 py-3">
              <span className="text-sm text-muted-foreground">{t("outputs.requiredWealthAtFfp")}</span>
              <span className="text-xl font-bold text-primary">
                {formatCompact(output.requiredWealthAtFFPAge)}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            <Link href={toLocalizedPath("/profile?tab=results")} className="text-primary hover:underline">
              {t("detailsLink", { tab: common("results") })}
            </Link>
          </p>
          {outputQuery.isFetching && (
            <p className="mt-1 text-xs text-muted-foreground">{t("updating")}</p>
          )}
        </div>
      )}
    </ScenarioInputModal>
  );
}

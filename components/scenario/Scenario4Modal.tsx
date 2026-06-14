"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { formatCompact } from "@/utils/formatCompact";
import Button from "@/components/common/Button";
import Link from "next/link";
import LifeExpectancyField from "@/components/scenario/LifeExpectancyField";
import ScenarioInputModal from "@/components/scenario/ScenarioInputModal";
import ScenarioStatList from "@/components/scenario/ScenarioStatList";
import { useLifeExpectancyOptions } from "@/hooks/scenario/useLifeExpectancyOptions";
import { useGetScenario1Input } from "@/hooks/scenario/useScenario1";
import {
  useGetScenario4Input,
  useGetScenario4Output,
  useCreateScenario4Input,
  useUpdateScenario4Input,
} from "@/hooks/scenario/useScenario4";
import { useLocale, useLocalizedPath, useTranslations } from "@/i18n/client";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

interface Scenario4ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Scenario4Modal({ isOpen, onClose }: Scenario4ModalProps) {
  const t = useTranslations("Scenario");
  const common = useTranslations("Common");
  const home = useTranslations("Home.features");
  const getApiErrorMessage = useApiErrorMessage();
  const locale = useLocale();
  const toLocalizedPath = useLocalizedPath();
  const scenario1InputQuery = useGetScenario1Input();
  const inputQuery = useGetScenario4Input();
  const outputQuery = useGetScenario4Output();
  const createMutation = useCreateScenario4Input();
  const updateMutation = useUpdateScenario4Input();
  const { defaultValue: defaultLifeExpectancy } = useLifeExpectancyOptions();

  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (inputQuery.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLifeExpectancy(String(inputQuery.data.lifeExpectancy));
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

    const resolvedInputFfpAge =
      scenario1InputQuery.data?.inputFfpAge ?? inputQuery.data?.inputFfpAge;
    const resolvedInputFfpAnnualSpending =
      scenario1InputQuery.data?.inputFfpAnnualSpending ?? inputQuery.data?.inputFfpAnnualSpending;

    if (resolvedInputFfpAge == null || resolvedInputFfpAnnualSpending == null) {
      setSubmitError(t("fallbackError"));
      return;
    }

    const payload = {
      lifeExpectancy: Number(lifeExpectancy),
      inputFfpAge: resolvedInputFfpAge,
      inputFfpAnnualSpending: resolvedInputFfpAnnualSpending,
    };

    const mutation = inputQuery.data ? updateMutation : createMutation;
    await mutation.mutateAsync(payload).catch((err: unknown) => {
      setSubmitError(getApiErrorMessage(err, t("fallbackError")));
      return null;
    });
  }

  const output = outputQuery.data;
  const hasScenario4Targets =
    (scenario1InputQuery.data?.inputFfpAge ?? inputQuery.data?.inputFfpAge) != null &&
    (scenario1InputQuery.data?.inputFfpAnnualSpending ?? inputQuery.data?.inputFfpAnnualSpending) != null;
  const stats = output == null
    ? []
    : [
        {
          label: t("outputs.requiredAnnualSaving"),
          value: formatCompact(output.requiredAnnualSaving, locale),
        },
        {
          label: t("outputs.requiredWealthAtFfp"),
          value: formatCompact(output.requiredWealthAtFFPAge, locale),
        },
      ];

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

        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            isSubmitting ||
            inputQuery.isLoading ||
            scenario1InputQuery.isLoading ||
            !lifeExpectancy ||
            !hasScenario4Targets
          }
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
          <ScenarioStatList
            items={stats}
            itemClassName="rounded-2xl"
            valueClassName="text-xl"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {locale === "vi" ? "Xem chi tiết thống kê tại " : "See detail statss in "}
            <Link href={toLocalizedPath("/profile?tab=results")} className="text-primary hover:underline">
              {locale === "vi" ? "trang hồ sơ" : "Profile page"}
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

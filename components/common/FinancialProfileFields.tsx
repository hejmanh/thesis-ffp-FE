"use client";

import FormField from "@/components/common/FormField";
import type { SelectOption } from "@/utils/referenceOptions";
import { useTranslations } from "@/i18n/client";

type RootFieldKey =
  | "estimatedLifeExpectancy"
  | "desiredLifeExpectancy"
  | "currentSavings"
  | "preferredCurrency";

type AllocationPeriod = "before" | "after";
type AllocationKey = "u" | "mu" | "rf";

interface AllocationValues {
  u: string;
  mu: string;
  rf: string;
}

interface HabitField<HabitKey extends string> {
  key: HabitKey;
  label: string;
  value: string;
  options: SelectOption[];
}

interface FinancialProfileFieldsProps<HabitKey extends string> {
  profile: Record<RootFieldKey, string>;
  allocations: Record<AllocationPeriod, AllocationValues>;
  habits: HabitField<HabitKey>[];
  onRootChange: (field: RootFieldKey, value: string) => void;
  onAllocationChange: (
    period: AllocationPeriod,
    key: AllocationKey,
    value: string,
  ) => void;
  onHabitChange: (key: HabitKey, value: string) => void;
  idPrefix?: string;
  cardClassName?: string;
  infoCardClassName?: string;
  titleClassName?: string;
  hintClassName?: string;
  fieldLabels?: Partial<Record<RootFieldKey, string>>;
  currentSavingsPlaceholder?: string;
  currencyOptions?: SelectOption[];
  disabledRootFields?: Partial<Record<RootFieldKey, boolean>>;
  footer?: React.ReactNode;
}

export default function FinancialProfileFields<HabitKey extends string>({
  profile,
  allocations,
  habits,
  onRootChange,
  onAllocationChange,
  onHabitChange,
  idPrefix = "",
  cardClassName = "rounded-xl border border-border bg-slate-50 p-4",
  infoCardClassName = "rounded-xl border border-border bg-white p-4",
  titleClassName = "text-base font-semibold text-slate-900",
  hintClassName = "mt-1 text-xs italic text-slate-600",
  fieldLabels,
  currentSavingsPlaceholder = "e.g. 100 000",
  currencyOptions = [],
  disabledRootFields,
  footer,
}: FinancialProfileFieldsProps<HabitKey>) {
  const fields = useTranslations("Fields");
  const t = useTranslations("FinancialProfile");
  const labels = {
    estimatedLifeExpectancy: fields("estimatedLifeExpectancy"),
    desiredLifeExpectancy: fields("desiredLifeExpectancy"),
    currentSavings: fields("currentSavings"),
    preferredCurrency: fields("currency"),
    ...fieldLabels,
  };
  const allocationLabels: Record<
    AllocationKey,
    { description: string; symbol: string }
  > = {
    u: { description: t("allocation.riskyAsset"), symbol: "u" },
    mu: {
      description: t("allocation.expectedReturn"),
      symbol: "mu",
    },
    rf: { description: t("allocation.riskFreeRate"), symbol: "r_f" },
  };
  const allocationPeriods: Array<{
    key: AllocationPeriod;
    label: string;
    hint: string;
  }> = [
    {
      key: "before",
      label: t("allocation.beforeLabel"),
      hint: t("allocation.beforeHint"),
    },
    {
      key: "after",
      label: t("allocation.afterLabel"),
      hint: t("allocation.afterHint"),
    },
  ];
  const orderedHabits = [...habits].sort((left, right) => {
    const priority: Record<string, number> = {
      physical: 0,
      diet: 1,
      smoking: 2,
      alcohol: 3,
    };

    const leftIndex = priority[String(left.key)] ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = priority[String(right.key)] ?? Number.MAX_SAFE_INTEGER;

    return leftIndex - rightIndex;
  });

  return (
    <div className={cardClassName}>
      <div className="space-y-6">
        <div className={infoCardClassName}>
          <h3 className={titleClassName}>{t("lifeExpectancyAndSavings")}</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id={`${idPrefix}estimatedLifeExpectancy`}
              name={`${idPrefix}estimatedLifeExpectancy`}
              label={labels.estimatedLifeExpectancy}
              hint={t("estimatedHint")}
              inputClassName="h-11"
              placeholder="90"
              inputProps={{
                value: profile.estimatedLifeExpectancy,
                onChange: (event) =>
                  onRootChange("estimatedLifeExpectancy", event.target.value),
                autoComplete: "off",
                disabled: disabledRootFields?.estimatedLifeExpectancy,
              }}
            />
            <FormField
              id={`${idPrefix}desiredLifeExpectancy`}
              name={`${idPrefix}desiredLifeExpectancy`}
              label={labels.desiredLifeExpectancy}
              hint={t("desiredHint")}
              inputClassName="h-11"
              placeholder={fields("placeholderLifeExpectancy")}
              inputProps={{
                value: profile.desiredLifeExpectancy,
                onChange: (event) =>
                  onRootChange("desiredLifeExpectancy", event.target.value),
                autoComplete: "off",
                disabled: disabledRootFields?.desiredLifeExpectancy,
              }}
            />
            <FormField
              id={`${idPrefix}currentSavings`}
              name={`${idPrefix}currentSavings`}
              label={labels.currentSavings}
              inputClassName="h-11"
              placeholder={currentSavingsPlaceholder}
              inputProps={{
                value: profile.currentSavings,
                onChange: (event) =>
                  onRootChange("currentSavings", event.target.value),
                autoComplete: "off",
                disabled: disabledRootFields?.currentSavings,
              }}
            />
            <FormField
              id={`${idPrefix}preferredCurrency`}
              name={`${idPrefix}preferredCurrency`}
              label={labels.preferredCurrency}
              variant="select"
              selectClassName="h-11"
              value={profile.preferredCurrency}
              onChange={(value) => onRootChange("preferredCurrency", value)}
              options={currencyOptions}
            />
          </div>
        </div>

        <div className={infoCardClassName}>
          <h3 className={titleClassName}>{t("investmentPortfolio")}</h3>
          <div className="mt-4 space-y-6">
            {allocationPeriods.map((period) => (
              <div key={period.key}>
                <p className="text-sm font-semibold text-slate-700">
                  {period.label}
                </p>
                <p className={hintClassName}>{period.hint}</p>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {(["u", "mu", "rf"] as const).map((key) => (
                    <div
                      key={`${period.key}_${key}`}
                      className="grid h-full grid-rows-[1fr_auto] gap-2"
                    >
                      <div>
                        <p className="text-sm text-slate-700">
                          {allocationLabels[key].description}
                        </p>
                        <p className="text-xs italic text-slate-500">
                          {allocationLabels[key].symbol}
                        </p>
                      </div>
                      <FormField
                        label=""
                        id={`${idPrefix}${period.key}_${key}`}
                        name={`${idPrefix}${period.key}_${key}`}
                        inputContainerClassName="w-20"
                        inputClassName="h-11 px-2 pr-5"
                        suffix="%"
                        inputProps={{
                          "aria-label": `${period.label} ${allocationLabels[key].description} (${allocationLabels[key].symbol})`,
                          value: allocations[period.key][key],
                          onChange: (event) =>
                            onAllocationChange(
                              period.key,
                              key,
                              event.target.value,
                            ),
                          autoComplete: "off",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={infoCardClassName}>
          <h3 className={titleClassName}>{t("lifestyle")}</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {orderedHabits.map((habit) => (
              <FormField
                key={habit.key}
                id={`${idPrefix}habit_${habit.key}`}
                name={`${idPrefix}habit_${habit.key}`}
                label={habit.label}
                variant="select"
                selectClassName="h-11"
                placeholder={fields("selectLevel")}
                value={habit.value}
                onChange={(value) => onHabitChange(habit.key, value)}
                options={habit.options}
              />
            ))}
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
}

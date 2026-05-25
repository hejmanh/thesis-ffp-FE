import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";
import {
  mapCurrenciesToOptions,
  mapIdReferencesToOptions,
} from "@/utils/referenceOptions";

function getQueryErrorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

function extractEstimatedLifeExpectancy(data: unknown): number {
  if (typeof data === "number") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const candidate = data as {
      estimatedLifeExpectancy?: number | null;
      lifeExpectancy?: number | null;
      value?: number | null;
    };
    const resolvedValue =
      candidate.estimatedLifeExpectancy ??
      candidate.lifeExpectancy ??
      candidate.value;

    if (typeof resolvedValue === "number") {
      return resolvedValue;
    }
  }

  throw new Error(
    "Estimated life expectancy response is missing a numeric value",
  );
}

export const useOnboardingReferences = () => {
  const estimateLifeExpectancyQuery = useQuery({
    queryKey: ["reference", "estimate-life-expectancy"],
    queryFn: async () => {
      const res = await referenceApi.getEstimateLifeExpectancy();
      if (!res.success) {
        throw new Error(
          res.error ?? "Failed to load estimated life expectancy",
        );
      }
      return String(extractEstimatedLifeExpectancy(res.data));
    },
    staleTime: Infinity,
  });

  const currenciesQuery = useQuery({
    queryKey: ["reference", "currencies"],
    queryFn: async () => {
      const res = await referenceApi.getCurrencies();
      if (!res.success) {
        throw new Error(res.error ?? "Failed to load currencies");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });

  const smokingTypesQuery = useQuery({
    queryKey: ["reference", "smoking-types"],
    queryFn: async () => {
      const res = await referenceApi.getSmokingTypes();
      if (!res.success) {
        throw new Error(res.error ?? "Failed to load smoking types");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });

  const physicalActivityTypesQuery = useQuery({
    queryKey: ["reference", "physical-activity-types"],
    queryFn: async () => {
      const res = await referenceApi.getPhysicalActivityTypes();
      if (!res.success) {
        throw new Error(res.error ?? "Failed to load physical activity types");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });

  const dietQualityTypesQuery = useQuery({
    queryKey: ["reference", "diet-quality-types"],
    queryFn: async () => {
      const res = await referenceApi.getDietQualityTypes();
      if (!res.success) {
        throw new Error(res.error ?? "Failed to load diet quality types");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });

  const alcoholConsumptionTypesQuery = useQuery({
    queryKey: ["reference", "alcohol-consumption-types"],
    queryFn: async () => {
      const res = await referenceApi.getAlcoholConsumptionTypes();
      if (!res.success) {
        throw new Error(
          res.error ?? "Failed to load alcohol consumption types",
        );
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });

  const assetTypesQuery = useQuery({
    queryKey: ["reference", "asset-types"],
    queryFn: async () => {
      const res = await referenceApi.getAssetTypes();
      if (!res.success) {
        throw new Error(res.error ?? "Failed to load asset types");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });

  const error =
    getQueryErrorMessage(estimateLifeExpectancyQuery.error) ??
    getQueryErrorMessage(currenciesQuery.error) ??
    getQueryErrorMessage(smokingTypesQuery.error) ??
    getQueryErrorMessage(physicalActivityTypesQuery.error) ??
    getQueryErrorMessage(dietQualityTypesQuery.error) ??
    getQueryErrorMessage(alcoholConsumptionTypesQuery.error) ??
    getQueryErrorMessage(assetTypesQuery.error);

  return useMemo(
    () => ({
      estimatedLifeExpectancy: estimateLifeExpectancyQuery.data ?? "",
      currencyOptions: mapCurrenciesToOptions(currenciesQuery.data ?? []),
      smokingOptions: mapIdReferencesToOptions(smokingTypesQuery.data ?? []),
      physicalActivityOptions: mapIdReferencesToOptions(
        physicalActivityTypesQuery.data ?? [],
      ),
      dietQualityOptions: mapIdReferencesToOptions(
        dietQualityTypesQuery.data ?? [],
      ),
      alcoholConsumptionOptions: mapIdReferencesToOptions(
        alcoholConsumptionTypesQuery.data ?? [],
      ),
      assetTypeOptions: mapIdReferencesToOptions(assetTypesQuery.data ?? []),
      currencies: currenciesQuery.data ?? [],
      isLoading:
        estimateLifeExpectancyQuery.isLoading ||
        currenciesQuery.isLoading ||
        smokingTypesQuery.isLoading ||
        physicalActivityTypesQuery.isLoading ||
        dietQualityTypesQuery.isLoading ||
        alcoholConsumptionTypesQuery.isLoading ||
        assetTypesQuery.isLoading,
      error,
    }),
    [
      alcoholConsumptionTypesQuery.data,
      alcoholConsumptionTypesQuery.isLoading,
      assetTypesQuery.data,
      assetTypesQuery.isLoading,
      currenciesQuery.data,
      currenciesQuery.isLoading,
      dietQualityTypesQuery.data,
      dietQualityTypesQuery.isLoading,
      error,
      estimateLifeExpectancyQuery.data,
      estimateLifeExpectancyQuery.isLoading,
      physicalActivityTypesQuery.data,
      physicalActivityTypesQuery.isLoading,
      smokingTypesQuery.data,
      smokingTypesQuery.isLoading,
    ],
  );
};

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";
import {
  mapCurrenciesToOptions,
  mapIdReferencesToOptions,
} from "@/utils/referenceOptions";

function getErrorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

export const useFinancialPlanningReferences = () => {
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
    getErrorMessage(currenciesQuery.error) ??
    getErrorMessage(smokingTypesQuery.error) ??
    getErrorMessage(physicalActivityTypesQuery.error) ??
    getErrorMessage(dietQualityTypesQuery.error) ??
    getErrorMessage(alcoholConsumptionTypesQuery.error) ??
    getErrorMessage(assetTypesQuery.error);

  return useMemo(
    () => ({
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
      physicalActivityTypesQuery.data,
      physicalActivityTypesQuery.isLoading,
      smokingTypesQuery.data,
      smokingTypesQuery.isLoading,
    ],
  );
};

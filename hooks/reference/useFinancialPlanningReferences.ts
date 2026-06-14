import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";
import {
  mapCountriesToOptions,
  mapCurrenciesToOptions,
  mapIdReferencesToOptions,
  mapSexTypesToOptions,
} from "@/utils/referenceOptions";
import { throwApiClientError } from "@/lib/ApiClientError";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

export const useFinancialPlanningReferences = () => {
  const getApiErrorMessage = useApiErrorMessage();
  const currenciesQuery = useQuery({
    queryKey: ["reference", "currencies"],
    queryFn: async () => {
      const res = await referenceApi.getCurrencies();
      if (!res.success) {
        throwApiClientError(res, "Failed to load currencies");
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
        throwApiClientError(res, "Failed to load smoking types");
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
        throwApiClientError(res, "Failed to load physical activity types");
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
        throwApiClientError(res, "Failed to load diet quality types");
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
        throwApiClientError(res, "Failed to load alcohol consumption types");
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
        throwApiClientError(res, "Failed to load asset types");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });
  const countriesQuery = useQuery({
    queryKey: ["reference", "countries"],
    queryFn: async () => {
      const res = await referenceApi.getCountries();
      if (!res.success) {
        throwApiClientError(res, "Failed to load countries");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });
  const sexTypesQuery = useQuery({
    queryKey: ["reference", "sex-types"],
    queryFn: async () => {
      const res = await referenceApi.getSexTypes();
      if (!res.success) {
        throwApiClientError(res, "Failed to load sex types");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
  });

  const error =
    (currenciesQuery.error
      ? getApiErrorMessage(currenciesQuery.error, "Failed to load currencies")
      : null) ??
    (smokingTypesQuery.error
      ? getApiErrorMessage(smokingTypesQuery.error, "Failed to load smoking types")
      : null) ??
    (physicalActivityTypesQuery.error
      ? getApiErrorMessage(
          physicalActivityTypesQuery.error,
          "Failed to load physical activity types",
        )
      : null) ??
    (dietQualityTypesQuery.error
      ? getApiErrorMessage(
          dietQualityTypesQuery.error,
          "Failed to load diet quality types",
        )
      : null) ??
    (alcoholConsumptionTypesQuery.error
      ? getApiErrorMessage(
          alcoholConsumptionTypesQuery.error,
          "Failed to load alcohol consumption types",
        )
      : null) ??
    (assetTypesQuery.error
      ? getApiErrorMessage(assetTypesQuery.error, "Failed to load asset types")
      : null) ??
    (countriesQuery.error
      ? getApiErrorMessage(countriesQuery.error, "Failed to load countries")
      : null) ??
    (sexTypesQuery.error
      ? getApiErrorMessage(sexTypesQuery.error, "Failed to load sex types")
      : null);

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
      countryOptions: mapCountriesToOptions(countriesQuery.data ?? []),
      sexTypeOptions: mapSexTypesToOptions(sexTypesQuery.data ?? []),
      currencies: currenciesQuery.data ?? [],
      isLoading:
        currenciesQuery.isLoading ||
        smokingTypesQuery.isLoading ||
        physicalActivityTypesQuery.isLoading ||
        dietQualityTypesQuery.isLoading ||
        alcoholConsumptionTypesQuery.isLoading ||
        assetTypesQuery.isLoading ||
        countriesQuery.isLoading ||
        sexTypesQuery.isLoading,
      error,
    }),
    [
      alcoholConsumptionTypesQuery.data,
      alcoholConsumptionTypesQuery.isLoading,
      assetTypesQuery.data,
      assetTypesQuery.isLoading,
      countriesQuery.data,
      countriesQuery.isLoading,
      currenciesQuery.data,
      currenciesQuery.isLoading,
      dietQualityTypesQuery.data,
      dietQualityTypesQuery.isLoading,
      error,
      physicalActivityTypesQuery.data,
      physicalActivityTypesQuery.isLoading,
      sexTypesQuery.data,
      sexTypesQuery.isLoading,
      smokingTypesQuery.data,
      smokingTypesQuery.isLoading,
    ],
  );
};

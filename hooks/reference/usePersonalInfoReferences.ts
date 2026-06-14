import { useCountriesQuery } from "@/hooks/reference/useCountriesQuery";
import { useSexTypesQuery } from "@/hooks/reference/useSexTypesQuery";
import { useApiErrorMessage } from "@/hooks/useApiErrorMessage";

export const usePersonalInfoReferences = () => {
  const getApiErrorMessage = useApiErrorMessage();
  const countriesQuery = useCountriesQuery();
  const sexTypesQuery = useSexTypesQuery();

  return {
    countries: countriesQuery.data ?? [],
    sexTypes: sexTypesQuery.data ?? [],
    isLoading: countriesQuery.isLoading || sexTypesQuery.isLoading,
    error:
      (countriesQuery.error
        ? getApiErrorMessage(countriesQuery.error, "Failed to load countries")
        : null) ??
      (sexTypesQuery.error
        ? getApiErrorMessage(sexTypesQuery.error, "Failed to load sex types")
        : null),
  };
};

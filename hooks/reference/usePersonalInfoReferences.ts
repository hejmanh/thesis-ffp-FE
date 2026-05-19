import { useCountriesQuery } from "@/hooks/reference/useCountriesQuery";
import { useSexTypesQuery } from "@/hooks/reference/useSexTypesQuery";

export const usePersonalInfoReferences = () => {
  const countriesQuery = useCountriesQuery();
  const sexTypesQuery = useSexTypesQuery();

  return {
    countries: countriesQuery.data ?? [],
    sexTypes: sexTypesQuery.data ?? [],
    isLoading: countriesQuery.isLoading || sexTypesQuery.isLoading,
  };
};

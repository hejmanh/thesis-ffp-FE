import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ["reference", "countries"],
    queryFn: async () => {
      const res = await referenceApi.getCountries();
      if (!res.success) {
        throw new Error(res.error ?? "Failed to load countries");
      }
      return res.data;
    },
    staleTime: Infinity,
  });
};

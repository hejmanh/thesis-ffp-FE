import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";
import { throwApiClientError } from "@/lib/ApiClientError";

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ["reference", "countries"],
    queryFn: async () => {
      const res = await referenceApi.getCountries();
      if (!res.success) {
        throwApiClientError(res, "Failed to load countries");
      }
      return res.data;
    },
    staleTime: Infinity,
  });
};

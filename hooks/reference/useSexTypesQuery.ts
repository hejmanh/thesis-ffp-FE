import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";
import { throwApiClientError } from "@/lib/ApiClientError";

export const useSexTypesQuery = () => {
  return useQuery({
    queryKey: ["reference", "sex-types"],
    queryFn: async () => {
      const res = await referenceApi.getSexTypes();
      if (!res.success) {
        throwApiClientError(res, "Failed to load sex types");
      }
      return res.data;
    },
    staleTime: Infinity,
  });
};

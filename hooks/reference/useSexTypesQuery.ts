import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";

export const useSexTypesQuery = () => {
  return useQuery({
    queryKey: ["reference", "sex-types"],
    queryFn: async () => {
      const res = await referenceApi.getSexTypes();
      if (!res.success) {
        throw new Error(res.error ?? "Failed to load sex types");
      }
      return res.data;
    },
    staleTime: Infinity,
  });
};

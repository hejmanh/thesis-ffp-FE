import { useQuery } from "@tanstack/react-query";
import { referenceApi } from "@/api/reference.api";
import { throwApiClientError } from "@/lib/ApiClientError";

export const useLifeStageRangesQuery = (birthYear: string) => {
  const parsedBirthYear = Number(birthYear);
  const enabled = Number.isInteger(parsedBirthYear) && parsedBirthYear > 0;

  const query = useQuery({
    queryKey: ["reference", "life-stage-ranges", parsedBirthYear],
    queryFn: async () => {
      const res = await referenceApi.getLifeStageRanges(parsedBirthYear);
      if (!res.success) {
        throwApiClientError(res, "Failed to load life stage ranges");
      }
      return res.data ?? [];
    },
    staleTime: Infinity,
    enabled,
  });

  return { ...query, enabled };
};

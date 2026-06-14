import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scenarioApi } from "@/api/scenario.api";
import { useAuthStore } from "@/store/auth.store";
import type { Scenario4Input } from "@/types/scenario";
import { throwApiClientError } from "@/lib/ApiClientError";

export const SCENARIO4_KEYS = {
  input: ["scenario", "4", "input"] as const,
  output: ["scenario", "4", "output"] as const,
};

export function useGetScenario4Input() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO4_KEYS.input,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario4Input();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useGetScenario4Output() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO4_KEYS.output,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario4Output();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useCreateScenario4Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Scenario4Input) =>
      scenarioApi.createScenario4Input(payload).then((res) => {
        if (!res.success) throwApiClientError(res, "Unable to save Scenario 4 input");
        return res;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO4_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO4_KEYS.output });
    },
  });
}

export function useUpdateScenario4Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Scenario4Input>) =>
      scenarioApi.updateScenario4Input(payload).then((res) => {
        if (!res.success) throwApiClientError(res, "Unable to update Scenario 4 input");
        return res;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO4_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO4_KEYS.output });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scenarioApi } from "@/api/scenario.api";
import { useAuthStore } from "@/store/auth.store";
import type { Scenario3Input } from "@/types/scenario";

export const SCENARIO3_KEYS = {
  input: ["scenario", "3", "input"] as const,
  output: ["scenario", "3", "output"] as const,
};

export function useGetScenario3Input() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO3_KEYS.input,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario3Input();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useGetScenario3Output() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO3_KEYS.output,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario3Output();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useCreateScenario3Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Scenario3Input) =>
      scenarioApi.createScenario3Input(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO3_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO3_KEYS.output });
    },
  });
}

export function useUpdateScenario3Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Scenario3Input>) =>
      scenarioApi.updateScenario3Input(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO3_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO3_KEYS.output });
    },
  });
}

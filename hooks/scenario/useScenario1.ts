import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scenarioApi } from "@/api/scenario.api";
import { useAuthStore } from "@/store/auth.store";
import type { Scenario1Input } from "@/types/scenario";

export const SCENARIO1_KEYS = {
  input: ["scenario", "1", "input"] as const,
  output: ["scenario", "1", "output"] as const,
};

export function useGetScenario1Input() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO1_KEYS.input,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario1Input();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useGetScenario1Output() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO1_KEYS.output,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario1Output();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useCreateScenario1Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Scenario1Input) =>
      scenarioApi.createScenario1Input(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO1_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO1_KEYS.output });
    },
  });
}

export function useUpdateScenario1Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Scenario1Input>) =>
      scenarioApi.updateScenario1Input(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO1_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO1_KEYS.output });
    },
  });
}

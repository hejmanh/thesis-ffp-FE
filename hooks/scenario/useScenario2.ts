import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scenarioApi } from "@/api/scenario.api";
import { useAuthStore } from "@/store/auth.store";
import type { Scenario2Input } from "@/types/scenario";

export const SCENARIO2_KEYS = {
  input: ["scenario", "2", "input"] as const,
  output: ["scenario", "2", "output"] as const,
};

export function useGetScenario2Input() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO2_KEYS.input,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario2Input();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useGetScenario2Output() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SCENARIO2_KEYS.output,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await scenarioApi.getScenario2Output();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
  });
}

export function useCreateScenario2Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Scenario2Input) =>
      scenarioApi.createScenario2Input(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO2_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO2_KEYS.output });
    },
  });
}

export function useUpdateScenario2Input() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Scenario2Input>) =>
      scenarioApi.updateScenario2Input(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCENARIO2_KEYS.input });
      queryClient.invalidateQueries({ queryKey: SCENARIO2_KEYS.output });
    },
  });
}

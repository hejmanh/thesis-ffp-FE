import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { consentApi } from "@/api/consent.api";
import { useAuthStore } from "@/store/auth.store";
import { throwApiClientError } from "@/lib/ApiClientError";
import type { ConsentPayload } from "@/types/consent";

export const CONSENT_KEYS = {
  status: ["consent", "status"] as const,
};

export function useGetConsentStatus() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: CONSENT_KEYS.status,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await consentApi.getStatus();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
    staleTime: 0,
  });
}

export function useRecordConsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConsentPayload) =>
      consentApi.record(payload).then((res) => {
        if (!res.success) throwApiClientError(res, "Failed to record consent");
        return res;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSENT_KEYS.status });
    },
  });
}

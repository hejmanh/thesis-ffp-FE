import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { surveyApi } from "@/api/survey.api";
import { useAuthStore } from "@/store/auth.store";
import { throwApiClientError } from "@/lib/ApiClientError";
import { useLocale } from "@/i18n/client";
import type { SurveyResponsePayload } from "@/types/survey";

export const SURVEY_KEYS = {
  questions: (locale: string) => ["survey", "questions", locale] as const,
  responseStatus: ["survey", "response-status"] as const,
};

export function useGetSurveyResponseStatus() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: SURVEY_KEYS.responseStatus,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await surveyApi.getResponseStatus();
      if (!res.success) return null;
      return res.data ?? null;
    },
    retry: false,
    staleTime: 0,
  });
}

export function useGetSurveyQuestions(enabled: boolean) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const locale = useLocale();
  return useQuery({
    queryKey: SURVEY_KEYS.questions(locale),
    enabled: isAuthenticated && enabled,
    queryFn: async () => {
      const res = await surveyApi.getQuestions(locale);
      if (!res.success) return [];
      return res.data ?? [];
    },
    retry: false,
  });
}

export function useSubmitSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SurveyResponsePayload) =>
      surveyApi.submitResponse(payload).then((res) => {
        if (!res.success) throwApiClientError(res, "Failed to submit survey");
        return res;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.responseStatus });
    },
  });
}

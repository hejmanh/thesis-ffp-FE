import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  SurveyQuestion,
  SurveyResponsePayload,
  SurveyResponseResult,
  SurveyResponseStatus,
} from "@/types/survey";

export const surveyApi = {
  getQuestions: (locale: string): Promise<ApiResponse<SurveyQuestion[]>> =>
    api.get(API_ENDPOINTS.survey.questions, { params: { locale } }),

  getResponseStatus: (): Promise<ApiResponse<SurveyResponseStatus>> =>
    api.get(API_ENDPOINTS.survey.responseStatus),

  submitResponse: (
    payload: SurveyResponsePayload,
  ): Promise<ApiResponse<SurveyResponseResult>> =>
    api.post(API_ENDPOINTS.survey.responses, payload),
};

import { api } from "@/lib/apiRequest";
import type { ApiResponse } from "@/shared/config/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  Scenario1Input,
  Scenario1Output,
  Scenario2Input,
  Scenario2Output,
  Scenario3Input,
  Scenario3Output,
  Scenario4Input,
  Scenario4Output,
} from "@/types/scenario";

export const scenarioApi = {
  // ── Scenario 1 ────────────────────────────────────────────────────────────
  getScenario1Input: (): Promise<ApiResponse<Scenario1Input>> =>
    api.get(API_ENDPOINTS.scenario1.input),

  createScenario1Input: (
    payload: Scenario1Input,
  ): Promise<ApiResponse<Scenario1Input>> =>
    api.post(API_ENDPOINTS.scenario1.input, payload),

  updateScenario1Input: (
    payload: Partial<Scenario1Input>,
  ): Promise<ApiResponse<Scenario1Input>> =>
    api.patch(API_ENDPOINTS.scenario1.input, payload),

  getScenario1Output: (): Promise<ApiResponse<Scenario1Output>> =>
    api.get(API_ENDPOINTS.scenario1.output),

  // ── Scenario 2 ────────────────────────────────────────────────────────────
  getScenario2Input: (): Promise<ApiResponse<Scenario2Input>> =>
    api.get(API_ENDPOINTS.scenario2.input),

  createScenario2Input: (
    payload: Scenario2Input,
  ): Promise<ApiResponse<Scenario2Input>> =>
    api.post(API_ENDPOINTS.scenario2.input, payload),

  updateScenario2Input: (
    payload: Partial<Scenario2Input>,
  ): Promise<ApiResponse<Scenario2Input>> =>
    api.patch(API_ENDPOINTS.scenario2.input, payload),

  getScenario2Output: (): Promise<ApiResponse<Scenario2Output>> =>
    api.get(API_ENDPOINTS.scenario2.output),

  // ── Scenario 3 ────────────────────────────────────────────────────────────
  getScenario3Input: (): Promise<ApiResponse<Scenario3Input>> =>
    api.get(API_ENDPOINTS.scenario3.input),

  createScenario3Input: (
    payload: Scenario3Input,
  ): Promise<ApiResponse<Scenario3Input>> =>
    api.post(API_ENDPOINTS.scenario3.input, payload),

  updateScenario3Input: (
    payload: Partial<Scenario3Input>,
  ): Promise<ApiResponse<Scenario3Input>> =>
    api.patch(API_ENDPOINTS.scenario3.input, payload),

  getScenario3Output: (): Promise<ApiResponse<Scenario3Output>> =>
    api.get(API_ENDPOINTS.scenario3.output),

  // ── Scenario 4 ────────────────────────────────────────────────────────────
  getScenario4Input: (): Promise<ApiResponse<Scenario4Input>> =>
    api.get(API_ENDPOINTS.scenario4.input),

  createScenario4Input: (
    payload: Scenario4Input,
  ): Promise<ApiResponse<Scenario4Input>> =>
    api.post(API_ENDPOINTS.scenario4.input, payload),

  updateScenario4Input: (
    payload: Partial<Scenario4Input>,
  ): Promise<ApiResponse<Scenario4Input>> =>
    api.patch(API_ENDPOINTS.scenario4.input, payload),

  getScenario4Output: (): Promise<ApiResponse<Scenario4Output>> =>
    api.get(API_ENDPOINTS.scenario4.output),
};

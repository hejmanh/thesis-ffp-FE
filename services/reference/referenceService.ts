import type { Country, SexType } from "@/types/reference";
import { referenceApi } from "@/api/reference.api";

export async function listCountries(): Promise<Country[]> {
  const response = await referenceApi.listCountries();
  if (!response.success) {
    throw new Error(response.error ?? "Unable to load countries");
  }
  return response.data ?? [];
}

export async function listSexTypes(): Promise<SexType[]> {
  const response = await referenceApi.listSexTypes();
  if (!response.success) {
    throw new Error(response.error ?? "Unable to load gender options");
  }
  return response.data ?? [];
}

import type { Country, SexType } from "@/types/reference";

export type SelectOption = {
  label: string;
  value: string;
};

export function mapCountriesToOptions(countries: Country[]): SelectOption[] {
  if (!countries.length) return [];
  return countries.map((country) => ({
    label: country.name ?? country.code ?? `Country ${country.id}`,
    value: String(country.id),
  }));
}

export function mapSexTypesToOptions(sexTypes: SexType[]): SelectOption[] {
  if (!sexTypes.length) return [];
  return sexTypes.map((sex) => ({
    label: sex.title ?? sex.code ?? `Type ${sex.id}`,
    value: String(sex.id),
  }));
}
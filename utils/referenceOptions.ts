import type {
  Country,
  Currency,
  ReferenceOption,
  SexType,
} from "@/types/reference";

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

export function mapCurrenciesToOptions(currencies: Currency[]): SelectOption[] {
  if (!currencies.length) return [];
  return currencies.map((currency) => ({
    label:
      currency.code && currency.name
        ? `${currency.code} - ${currency.name}`
        : (currency.code ?? currency.name ?? `Currency ${currency.id}`),
    value: String(currency.id),
  }));
}

function getReferenceOptionLabel(
  option: ReferenceOption,
  fallbackPrefix: string,
): string {
  return (
    option.title ??
    option.name ??
    option.code ??
    `${fallbackPrefix} ${option.id}`
  );
}

export function mapCodeReferencesToOptions<T extends ReferenceOption>(
  options: T[],
): SelectOption[] {
  if (!options.length) return [];
  return options.map((option) => ({
    label: getReferenceOptionLabel(option, "Reference"),
    value: option.code ?? String(option.id),
  }));
}

export function mapIdReferencesToOptions<T extends ReferenceOption>(
  options: T[],
): SelectOption[] {
  if (!options.length) return [];
  return options.map((option) => ({
    label: getReferenceOptionLabel(option, "Reference"),
    value: String(option.id),
  }));
}

export function resolveCurrencyCode(
  currencies: Currency[],
  currencyId: string | number | null | undefined,
): string {
  if (currencyId == null || currencyId === "") {
    return "";
  }

  const match = currencies.find(
    (currency) => String(currency.id) === String(currencyId),
  );
  return match?.code ?? String(currencyId);
}

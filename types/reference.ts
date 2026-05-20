export interface Country {
  id: number;
  code: string | null;
  name: string | null;
  currencyId: number | null;
  currencyCode: string | null;
}

export interface SexType {
  id: number;
  code: string | null;
  title: string | null;
}

export interface ReferenceOption {
  id: number;
  code: string | null;
  title?: string | null;
  name?: string | null;
}

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

export interface Currency {
  id: number;
  code: string | null;
  name: string | null;
  symbol?: string | null;
}

export interface AssetType extends ReferenceOption {
  title: string | null;
}

export interface SmokingType extends ReferenceOption {
  title: string | null;
}

export interface PhysicalActivityType extends ReferenceOption {
  title: string | null;
}

export interface DietQualityType extends ReferenceOption {
  title: string | null;
}

export interface AlcoholConsumptionType extends ReferenceOption {
  title: string | null;
}

export interface LifeStageRange {
  id: number;
  stageNo: number;
  title: string | null;
  beginningAge: number;
  endingAge: number | null;
}

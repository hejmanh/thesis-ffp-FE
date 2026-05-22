export type AccountTab = "personal" | "financial" | "preferences";

export interface Allocation {
  u: string;
  mu: string;
  rf: string;
}

export interface Habits {
  smoking: string;
  physical: string;
  diet: string;
  alcohol: string;
}

export interface Stage {
  lifeStageRangeId?: number;
  title?: string;
  startAge: string;
  endAge: string;
  annualSaving: string;
  currency: string;
  growthRate: string;
}

export interface Asset {
  id: string;
  uid?: string;
  assetTypeId: string;
  assetTypeCode?: string;
  assetTypeTitle?: string;
  initialAnnualIncome: string;
  growthRate: string;
}

export interface FinancialData {
  estimatedLE: string;
  savings: string;
  currency: string;
  desiredLE: string;
  allocation: {
    before: Allocation;
    after: Allocation;
  };
  habits: Habits;
  stages: Stage[];
  assets: Asset[];
}

export interface PersonalInfoData {
  email: string;
  birthYear: string;
  country: string;
  gender: string;
}

export interface PreferencesData {
  language: string;
}

export interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Step1AccountData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthYear: string;
  country: string;
  sex: string;
}

export interface AllocationData {
  u: string;
  mu: string;
  rf: string;
}

export interface HabitsData {
  smoke: string;
  physical: string;
  diet: string;
  alcohol: string;
}

export interface Step2PersonalData {
  estimatedLifeExpectancy: string;
  currentSavings: string;
  preferredCurrency: string;
  desiredLifeExpectancy: string;
  beforeFfp: AllocationData;
  afterFfp: AllocationData;
  habits: HabitsData;
}

export interface StageItem {
  id: string;
  ageStart: string;
  ageEnd: string;
  annualSaving: string;
  currency: string;
  annualRate: string;
}

export interface AssetItem {
  id: string;
  assetTypeId: string;
  initialAnnualIncome: string;
  growthRate: string;
}

export interface OnboardingDraft {
  step1: Step1AccountData;
  step2: Step2PersonalData;
  stages: StageItem[];
  assets: AssetItem[];
}

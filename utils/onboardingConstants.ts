import type { OnboardingDraft } from "@/types/onboarding";

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "VND", "JPY"];
export const SEX_OPTIONS = ["Male", "Female", "Other"];
export const HABIT_LEVELS = ["Low", "Moderate", "High"];
export const ASSET_TYPES = ["Stock", "Bond", "Cash", "Real Estate", "Crypto", "Other"];
export const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "Singapore",
  "South Korea",
  "Vietnam",
  "Thailand",
  "Philippines",
  "Indonesia",
  "Malaysia",
  "Argentina",
  "New Zealand",
  "South Africa",
  "UAE",
  "Saudi Arabia",
  "Hong Kong",
  "Taiwan",
  "Switzerland",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
];

export const INITIAL_ONBOARDING_DRAFT: OnboardingDraft = {
  step1: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthYear: "",
    country: "",
    sex: "",
  },
  step2: {
    currentSavings: "",
    preferredCurrency: "USD",
    desiredLifeExpectancy: "",
    beforeFfp: { u: "", mu: "", rf: "" },
    afterFfp: { u: "", mu: "", rf: "" },
    habits: {
      smoke: "",
      physical: "",
      diet: "",
      alcohol: "",
    },
  },
  stages: [],
  assets: [],
};

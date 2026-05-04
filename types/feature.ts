export type FeatureIconKey =
  | "solar:target-linear"
  | "solar:calendar-linear"
  | "solar:calculator-linear"
  | "iconoir:piggy-bank";

export interface FeatureItem {
  id: string;
  icon: FeatureIconKey;
  title: string;
  description: string;
  placeholder: string;
  ctaText: string;
  href?: string;
}

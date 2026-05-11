export type FeatureIconKey =
  | "mingcute:target-line"
  | "mingcute:calendar-2-line"
  | "icon-park-outline:calculator"
  | "mingcute:pig-money-line";

export interface FeatureItem {
  id: string;
  icon: FeatureIconKey;
  title: string;
  description: string;
  placeholder: string;
  ctaText: string;
  href?: string;
}

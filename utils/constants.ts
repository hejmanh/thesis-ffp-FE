import type { FeatureItem } from "@/types/feature";

export const FEATURES: FeatureItem[] = [
  {
    id: "01",
    icon: "mingcute:target-line",
    title: "Can I reach my FFP goal?",
    description:
      "Check if your current plan is achievable or if you're saving too little or too much.",
    placeholder: "Example: Retire by age 55",
    ctaText: "Explore Scenario",
    href: "/scenario/reach-goal",
  },
  {
    id: "02",
    icon: "mingcute:calendar-2-line",
    title: "When will I reach FFP?",
    description: "Calculate the age you can achieve financial freedom.",
    placeholder: "Example: If I save 20% monthly",
    ctaText: "Explore Scenario",
    href: "/scenario/timeline",
  },
  {
    id: "03",
    icon: "icon-park-outline:calculator",
    title: "How much can I spend at FFP?",
    description:
      "Find out your safe monthly spending once you reach financial freedom.",
    placeholder: "Example: Monthly budget after FFP",
    ctaText: "Explore Scenario",
    href: "/scenario/spending",
  },
  {
    id: "04",
    icon: "mingcute:pig-money-line",
    title: "How much should I save?",
    description: "Calculate the required monthly savings to reach your goal on time.",
    placeholder: "Example: Savings needed per month",
    ctaText: "Explore Scenario",
    href: "/scenario/savings",
  },
];

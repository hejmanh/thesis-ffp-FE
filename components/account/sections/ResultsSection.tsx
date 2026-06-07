"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Card from "@/components/common/Card";
import Scenario1Widget from "@/components/account/sections/results/Scenario1Widget";
import Scenario2Widget from "@/components/account/sections/results/Scenario2Widget";
import Scenario3Widget from "@/components/account/sections/results/Scenario3Widget";
import Scenario4Widget from "@/components/account/sections/results/Scenario4Widget";

interface ResultCard {
  id: string;
  title: string;
  icon: string;
  widget: ReactNode;
}

const RESULT_CARDS: ResultCard[] = [
  {
    id: "01",
    title: "Can I reach my FFP goal?",
    icon: "mingcute:target-line",
    widget: <Scenario1Widget />,
  },
  {
    id: "02",
    title: "When will I reach FFP?",
    icon: "mingcute:calendar-2-line",
    widget: <Scenario2Widget />,
  },
  {
    id: "03",
    title: "How much can I spend at FFP?",
    icon: "icon-park-outline:calculator",
    widget: <Scenario3Widget />,
  },
  {
    id: "04",
    title: "How much should I save?",
    icon: "mingcute:pig-money-line",
    widget: <Scenario4Widget />,
  },
];

export default function ResultsSection() {
  return (
    <div className="w-full space-y-5">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <h2 className="text-2xl font-semibold text-primary">Your Results</h2>
          <p className="mt-0.5 mb-2 text-sm text-muted-foreground">
              Your scenario results will be displayed here. You can view detailed insights for each scenario.
          </p>
          <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-600"
          >
              <Icon icon="mingcute:back-line" className="h-4 w-4" aria-hidden="true" />
              Back to scenarios explorer
          </Link>
      </div>
      

      <div className="flex flex-col gap-4">
        {RESULT_CARDS.map((card) => (
          <Card key={card.id} hoverable={false} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft">
                <Icon icon={card.icon} className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary">Scenario {card.id}</span>
                <h3 className="text-sm font-semibold text-slate-800">{card.title}</h3>
              </div>
            </div>
            {card.widget}
          </Card>
        ))}
      </div>
    </div>
  );
}

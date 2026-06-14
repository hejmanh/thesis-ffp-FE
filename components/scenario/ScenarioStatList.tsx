"use client";

interface ScenarioStatItem {
  label: string;
  value: string;
}

interface ScenarioStatListProps {
  items: ScenarioStatItem[];
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ScenarioStatList({
  items,
  className,
  itemClassName,
  labelClassName,
  valueClassName,
}: ScenarioStatListProps) {
  return (
    <div className={joinClasses("grid grid-cols-1 gap-3", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className={joinClasses(
            "flex items-center justify-between bg-primary-soft px-5 py-3",
            itemClassName,
          )}
        >
          <span className={joinClasses("text-sm text-muted-foreground", labelClassName)}>
            {item.label}
          </span>
          <span className={joinClasses("text-lg font-bold text-primary", valueClassName)}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

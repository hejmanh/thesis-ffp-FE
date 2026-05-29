"use client";

import { cn } from "@/utils/cn";

interface RegistrationProgressBarProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export default function RegistrationProgressBar({
  steps,
  currentStep,
  className,
}: RegistrationProgressBarProps) {
  const gridStyle = { gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative px-4">
        <div className="relative grid" style={gridStyle}>
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const connectorCompleted = stepNumber < currentStep;

            return (
              <div key={label} className="relative flex items-center justify-center">
                {stepNumber < steps.length ? (
                  <div className="absolute left-[50%] top-5 z-0 w-full pr-2">
                    <div className="h-px w-full bg-slate-300" />
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-px bg-primary transition-all",
                        connectorCompleted ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                ) : null}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    isCompleted || isActive
                      ? "border-primary bg-primary text-white"
                      : "border-slate-300 bg-white text-slate-500"
                  )}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-4 text-center" style={gridStyle}>
        {steps.map((label, index) => (
          <p
            key={label}
            className={cn(
              "text-base",
              index + 1 === currentStep
                ? "font-semibold text-primary"
                : "font-medium text-slate-600"
            )}
          >
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}

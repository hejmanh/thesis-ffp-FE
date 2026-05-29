"use client";

import Button from "@/components/common/Button";
import { cn } from "@/utils/cn";

interface StepNavigationActionsProps {
  className?: string;
  layout?: "row" | "column";
  nextLabel?: string;
  submittingLabel?: string;
  isSubmitting: boolean;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  onNext: () => void;
  onBack?: () => void;
}

export default function StepNavigationActions({
  className,
  layout = "row",
  nextLabel = "Next",
  submittingLabel = "Saving...",
  isSubmitting,
  nextDisabled = false,
  backDisabled,
  onNext,
  onBack,
}: StepNavigationActionsProps) {
  const isColumn = layout === "column";
  const buttonClassName = cn(
    "h-12 rounded-full text-base",
    isColumn ? "w-full" : "flex-1",
  );

  const nextButton = (
    <Button
      className={buttonClassName}
      onClick={onNext}
      disabled={nextDisabled || isSubmitting}
    >
      {isSubmitting ? submittingLabel : nextLabel}
    </Button>
  );

  const backButton = onBack ? (
    <Button
      variant="outline"
      className={buttonClassName}
      onClick={onBack}
      disabled={backDisabled ?? isSubmitting}
    >
      Back
    </Button>
  ) : null;

  return (
    <div
      className={cn(
        "mx-auto mt-8 flex gap-3",
        isColumn ? "flex-col" : "",
        className,
      )}
    >
      {isColumn ? (
        <>
          {nextButton}
          {backButton}
        </>
      ) : (
        <>
          {backButton}
          {nextButton}
        </>
      )}
    </div>
  );
}

"use client";

import { Icon } from "@iconify/react";
import Button from "@/components/common/Button";

interface RegisterSkipNoticeProps {
  disabled: boolean;
  onSkip: () => void;
}

export default function RegisterSkipNotice({
  disabled,
  onSkip,
}: RegisterSkipNoticeProps) {
  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto rounded-lg px-0 py-0 text-sm font-semibold"
        disabled={disabled}
        onClick={onSkip}
      >
        <Icon icon="ic:round-skip-previous" className="h-4 w-4" />
        Skip
      </Button>
      <p className="mt-2 ml-4 text-xs text-muted-foreground">
        * You can skip this setup for now and complete it later from the account
        page.
      </p>
    </div>
  );
}

"use client";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@/components/common/Button";
import { useTranslations } from "@/i18n/client";

interface RegisterSkipNoticeProps {
  disabled: boolean;
  onSkip: () => void;
}

export default function RegisterSkipNotice({
  disabled,
  onSkip,
}: RegisterSkipNoticeProps) {
  const t = useTranslations("Register.skip");

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto rounded-lg px-0 py-0 text-sm font-semibold"
        disabled={disabled}
        onClick={onSkip}
      >
        <PlayArrowIcon fontSize="small" />
        {t("action")}
      </Button>
      <p className="mt-2 ml-4 text-xs text-muted-foreground">
        {t("description")}
      </p>
    </div>
  );
}

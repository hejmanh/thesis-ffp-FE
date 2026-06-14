"use client";

import Button from "@/components/common/Button";
import { useLocaleRouter, useTranslations } from "@/i18n/client";

export default function RegisterCompletedView() {
  const router = useLocaleRouter();
  const t = useTranslations("Register.complete");

  return (
    <div className="py-16 text-center">
      <h2 className="text-4xl font-bold text-primary">{t("title")}</h2>
      <p className="mt-4 text-base text-muted-foreground">
        {t("description")}
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          className="h-12 rounded-full px-8 text-base"
          onClick={() => router.push("/profile")}
        >
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import type { PreferencesData } from "@/utils/types";
import { useTranslations } from "@/i18n/client";

const INITIAL_PREFERENCES: PreferencesData = {
  language: "English",
};

export default function PreferencesSection() {
  const t = useTranslations("Account.preferences");
  const tabs = useTranslations("Account.tabs");
  const common = useTranslations("Common");
  const [preferences, setPreferences] = useState<PreferencesData>(INITIAL_PREFERENCES);
  const languageOptions = [
    { label: t("english"), value: "English" },
    { label: t("vietnamese"), value: "Vietnamese" },
    { label: t("japanese"), value: "Japanese" },
    { label: t("german"), value: "German" },
  ];

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">{tabs("preferences")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 max-w-xl">
        <FormField
          label={t("language")}
          variant="select"
          selectClassName="h-11"
          value={preferences.language}
          onChange={(value) => setPreferences({ language: value })}
          options={languageOptions}
        />
      </div>

      <div className="mt-6">
        <Button className="h-11 rounded-full px-5">{common("save")}</Button>
      </div>
    </Card>
  );
}

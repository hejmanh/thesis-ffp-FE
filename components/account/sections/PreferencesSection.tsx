"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import type { PreferencesData } from "@/utils/types";

const LANGUAGE_OPTIONS = ["English", "Vietnamese", "Japanese", "German"];

const INITIAL_PREFERENCES: PreferencesData = {
  language: "English",
};

export default function PreferencesSection() {
  const [preferences, setPreferences] = useState<PreferencesData>(INITIAL_PREFERENCES);

  return (
    <Card hoverable={false} className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary">Preferences</h2>
      <p className="mt-1 text-sm text-muted-foreground">Set your account preferences.</p>

      <div className="mt-6 max-w-xl">
        <FormField
          label="Language"
          variant="select"
          selectClassName="h-11"
          value={preferences.language}
          onChange={(value) => setPreferences({ language: value })}
          options={LANGUAGE_OPTIONS.map((language) => ({ label: language, value: language }))}
        />
      </div>

      <div className="mt-6">
        <Button className="h-11 rounded-full px-5">Save</Button>
      </div>
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import Card from "@/components/common/Card";
import AccountBasicInfoCard from "@/components/account/sections/AccountBasicInfoCard";
import AccountPasswordCard from "@/components/account/sections/AccountPasswordCard";
import type { PersonalInfoData, SecurityData } from "@/utils/types";
import { usePersonalInfoReferences } from "@/hooks";
import {
  mapCountriesToOptions,
  mapSexTypesToOptions,
} from "@/utils/referenceOptions";

const INITIAL_PERSONAL_INFO: PersonalInfoData = {
  email: "",
  birthYear: "",
  country: "",
  gender: "",
};

const INITIAL_SECURITY_DATA: SecurityData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PersonalInfoSection() {
  const [personalData, setPersonalData] = useState<PersonalInfoData>(
    INITIAL_PERSONAL_INFO,
  );
  const [securityData, setSecurityData] = useState<SecurityData>(
    INITIAL_SECURITY_DATA,
  );
  const { countries, sexTypes } = usePersonalInfoReferences();
  const countryOptions = useMemo(
    () => mapCountriesToOptions(countries),
    [countries],
  );
  const sexOptions = useMemo(() => mapSexTypesToOptions(sexTypes), [sexTypes]);

  function updateSecurityField<K extends keyof SecurityData>(
    key: K,
    value: SecurityData[K],
  ) {
    setSecurityData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card
      hoverable={false}
      className="w-full rounded-xl bg-white p-6 shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary">
        Account and Basic Information
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your account settings and basic information.
      </p>
      <AccountBasicInfoCard
        data={personalData}
        onChange={setPersonalData}
        countryOptions={countryOptions}
        sexOptions={sexOptions}
      />

      <AccountPasswordCard data={securityData} onChange={updateSecurityField} />
    </Card>
  );
}

"use client";

import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import type { SelectOption } from "@/utils/referenceOptions";

interface GeneralInformationValue {
  name: string;
  birthYear: string;
  countryId: string;
  sexTypeId: string;
}

interface GeneralInformationFormProps {
  value: GeneralInformationValue;
  countryOptions: SelectOption[];
  sexTypeOptions: SelectOption[];
  canSave: boolean;
  isSaving: boolean;
  onChange: (next: GeneralInformationValue) => void;
  onSave: () => void;
}

export default function GeneralInformationForm({
  value,
  countryOptions,
  sexTypeOptions,
  canSave,
  isSaving,
  onChange,
  onSave,
}: GeneralInformationFormProps) {
  return (
    <div className="rounded-xl border border-border bg-slate-50 p-4">
      <h3 className="text-base font-semibold text-slate-900">
        General Information
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="detailed_name"
          name="detailed_name"
          label="Name"
          inputClassName="h-10"
          inputProps={{
            value: value.name,
            onChange: (event) =>
              onChange({
                ...value,
                name: event.target.value,
              }),
          }}
        />
        <FormField
          id="detailed_birth_year"
          name="detailed_birth_year"
          label="Birth Year"
          variant="select"
          selectClassName="h-11"
          value={value.birthYear}
          onChange={(birthYear) =>
            onChange({
              ...value,
              birthYear,
            })
          }
          options={Array.from(
            { length: new Date().getFullYear() - 1900 + 1 },
            (_, index) => {
              const year = String(new Date().getFullYear() - index);
              return { label: year, value: year };
            },
          )}
        />
        <FormField
          id="detailed_country"
          name="detailed_country"
          label="Country"
          variant="select"
          searchable={true}
          selectClassName="h-11"
          value={value.countryId}
          onChange={(countryId) =>
            onChange({
              ...value,
              countryId,
            })
          }
          options={countryOptions}
        />
        <FormField
          id="detailed_gender"
          name="detailed_gender"
          label="Gender"
          variant="select"
          selectClassName="h-11"
          value={value.sexTypeId}
          onChange={(sexTypeId) =>
            onChange({
              ...value,
              sexTypeId,
            })
          }
          options={sexTypeOptions}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={onSave} disabled={!canSave}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

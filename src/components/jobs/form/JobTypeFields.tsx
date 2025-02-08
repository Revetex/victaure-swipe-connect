
import { useFormContext } from "react-hook-form";
import { MissionTypeField } from "./fields/MissionTypeField";
import { ProvinceField } from "./fields/ProvinceField";
import { LanguageField } from "./fields/LanguageField";
import { ContractTypeField } from "./fields/ContractTypeField";
import { PaymentScheduleField } from "./fields/PaymentScheduleField";
import { ExperienceLevelField } from "./fields/ExperienceLevelField";
import { RemoteTypeField } from "./fields/RemoteTypeField";
import { UrgencyField } from "./fields/UrgencyField";

export function JobTypeFields() {
  const { watch } = useFormContext();
  const missionType = watch("mission_type");

  return (
    <div className="space-y-6">
      <MissionTypeField />
      <ProvinceField />
      <LanguageField />
      <ContractTypeField />
      <PaymentScheduleField />
      {missionType === "company" && <ExperienceLevelField />}
      <RemoteTypeField />
      <UrgencyField />
    </div>
  );
}


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const contractTypes = {
  company: [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Seasonal"
  ],
  individual: [
    "One-time",
    "Fixed-duration",
    "Project-based",
    "Consulting"
  ]
};

export function ContractTypeField() {
  const { control, watch } = useFormContext();
  const missionType = watch("mission_type");

  return (
    <FormField
      name="contract_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de contrat</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value || (missionType === "individual" ? "One-time" : "Full-time")}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de contrat" />
              </SelectTrigger>
              <SelectContent>
                {(missionType === "individual" ? contractTypes.individual : contractTypes.company).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

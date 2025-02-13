
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const contractTypes = {
  company: [
    { id: "full_time", label: "Temps plein" },
    { id: "part_time", label: "Temps partiel" },
    { id: "contract", label: "Contrat" },
    { id: "temporary", label: "Temporaire" },
    { id: "internship", label: "Stage" },
    { id: "seasonal", label: "Saisonnier" }
  ],
  individual: [
    { id: "one_time", label: "Unique" },
    { id: "fixed_duration", label: "Durée déterminée" },
    { id: "project_based", label: "Basé sur projet" },
    { id: "consulting", label: "Consultation" }
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
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || (missionType === "individual" ? "one_time" : "full_time")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de contrat" />
              </SelectTrigger>
              <SelectContent>
                {(missionType === "individual" ? contractTypes.individual : contractTypes.company).map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
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

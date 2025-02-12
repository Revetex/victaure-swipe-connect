
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const contractTypes = {
  company: [
    { value: "full_time", label: "Temps plein" },
    { value: "part_time", label: "Temps partiel" },
    { value: "contract", label: "Contrat" },
    { value: "temporary", label: "Temporaire" },
    { value: "internship", label: "Stage" }
  ],
  individual: [
    { value: "one_time", label: "Mission unique" },
    { value: "fixed_duration", label: "Durée fixe" },
    { value: "project_based", label: "Projet" }
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
                <SelectItem value="all">Tous les types</SelectItem>
                {(missionType === "individual" ? contractTypes.individual : contractTypes.company).map((type) => (
                  <SelectItem key={type.value} value={type.value}>
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


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const missionTypes = [
  { id: "company", label: "Mission d'entreprise" },
  { id: "individual", label: "Mission de particulier" }
];

export function MissionTypeField() {
  const { control } = useFormContext();

  return (
    <FormField
      name="mission_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de mission</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value || "company"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de mission" />
              </SelectTrigger>
              <SelectContent>
                {missionTypes.map((type) => (
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

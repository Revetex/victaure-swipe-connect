
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const missionTypes = [
  { value: "company", label: "Mission d'entreprise" },
  { value: "individual", label: "Mission de particulier" }
];

export function MissionTypeField() {
  const { control } = useFormContext();

  return (
    <FormField
      name="mission_type"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de mission</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || "select-mission"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de mission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-mission" disabled>
                  Sélectionnez le type de mission
                </SelectItem>
                {missionTypes.map((type) => (
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

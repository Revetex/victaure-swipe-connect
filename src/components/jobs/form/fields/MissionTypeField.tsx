
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

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
                <SelectItem value="company">Mission d'entreprise</SelectItem>
                <SelectItem value="individual">Mission de particulier</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

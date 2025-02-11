
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function UrgencyField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="is_urgent"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Urgence</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => field.onChange(value === 'true')} 
              defaultValue={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le niveau d'urgence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Normal</SelectItem>
                <SelectItem value="true">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

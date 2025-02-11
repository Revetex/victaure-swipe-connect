
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function RemoteTypeField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="remote_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de travail</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de travail" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-site">Sur place</SelectItem>
                <SelectItem value="hybrid">Hybride</SelectItem>
                <SelectItem value="remote">Télétravail</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

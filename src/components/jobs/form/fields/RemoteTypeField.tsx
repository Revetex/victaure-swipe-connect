
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const remoteTypes = [
  "On-site",
  "Remote",
  "Hybrid",
  "Flexible"
];

export function RemoteTypeField() {
  const { control } = useFormContext();

  return (
    <FormField
      name="remote_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de travail</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value || "On-site"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de travail" />
              </SelectTrigger>
              <SelectContent>
                {remoteTypes.map((type) => (
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

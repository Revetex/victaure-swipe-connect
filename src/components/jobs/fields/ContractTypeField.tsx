
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function ContractTypeField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="contract_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de contrat</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Temps plein</SelectItem>
                <SelectItem value="part-time">Temps partiel</SelectItem>
                <SelectItem value="contract">Contrat</SelectItem>
                <SelectItem value="temporary">Temporaire</SelectItem>
                <SelectItem value="internship">Stage</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

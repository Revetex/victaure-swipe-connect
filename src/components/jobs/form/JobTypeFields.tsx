import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function JobTypeFields() {
  return (
    <div className="space-y-4">
      <FormField
        name="contract_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contrat</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de contrat" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="full-time">CDI</SelectItem>
                <SelectItem value="part-time">CDD</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="internship">Stage</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
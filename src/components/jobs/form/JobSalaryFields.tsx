import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function JobSalaryFields() {
  return (
    <div className="space-y-4">
      <FormField
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Budget</FormLabel>
            <FormControl>
              <Input {...field} type="number" placeholder="Ex: 50000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function JobDetailsFields() {
  return (
    <div className="space-y-4">
      <FormField
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localisation</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Montréal, QC" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="experience_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Niveau d'expérience requis</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 2-3 ans" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
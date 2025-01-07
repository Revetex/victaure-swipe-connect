import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function JobCompanyFields() {
  return (
    <div className="space-y-4">
      <FormField
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'entreprise</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Ma Super Entreprise" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="company_website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site web</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://www.example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
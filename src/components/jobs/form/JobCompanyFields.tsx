import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export function JobCompanyFields() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations sur l'entreprise</h3>
      
      <FormField
        control={control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'entreprise</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Acme Inc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="company_website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site web</FormLabel>
            <FormControl>
              <Input placeholder="Ex: https://www.acme.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="company_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description de l'entreprise</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez votre entreprise..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
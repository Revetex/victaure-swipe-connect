
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function LanguageField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="language_requirements"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Langue requise</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la langue requise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="english">Anglais</SelectItem>
                <SelectItem value="bilingual">Bilingue</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

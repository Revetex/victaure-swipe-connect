
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const languageRequirements = [
  "English Only",
  "French Only",
  "Bilingual (English/French)",
  "Either English or French",
  "Multilingual"
];

export function LanguageField() {
  const { control } = useFormContext();

  return (
    <FormField
      name="language_requirements"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Exigences linguistiques</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value || "English Only"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez les exigences linguistiques" />
              </SelectTrigger>
              <SelectContent>
                {languageRequirements.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
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

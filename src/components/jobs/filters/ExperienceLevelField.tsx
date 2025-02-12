
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const experienceLevels = [
  { value: "entry", label: "Débutant" },
  { value: "junior", label: "Junior (1-3 ans)" },
  { value: "intermediate", label: "Intermédiaire (3-5 ans)" },
  { value: "senior", label: "Senior (5+ ans)" },
  { value: "expert", label: "Expert" },
  { value: "lead", label: "Lead" }
];

export function ExperienceLevelField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="experience_level"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Niveau d'expérience</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le niveau d'expérience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
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

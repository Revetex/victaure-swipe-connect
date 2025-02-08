
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const experienceLevels = [
  "Entry Level",
  "Junior (1-3 years)",
  "Intermediate (3-5 years)",
  "Senior (5+ years)",
  "Lead",
  "Expert"
];

export function ExperienceLevelField() {
  const { control } = useFormContext();

  return (
    <FormField
      name="experience_level"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Niveau d'expérience requis</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value || "Mid-Level"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le niveau d'expérience" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
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

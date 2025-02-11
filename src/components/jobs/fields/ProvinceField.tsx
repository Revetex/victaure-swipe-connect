
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const provinces = [
  "Québec",
  "Ontario",
  "Colombie-Britannique",
  "Alberta",
  "Manitoba",
  "Saskatchewan",
  "Nouvelle-Écosse",
  "Nouveau-Brunswick",
  "Terre-Neuve-et-Labrador",
  "Île-du-Prince-Édouard"
];

export function ProvinceField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="province"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Province</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
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

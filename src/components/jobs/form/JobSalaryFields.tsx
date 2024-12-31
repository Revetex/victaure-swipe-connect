import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const salaryPeriods = [
  { value: "hourly", label: "Par heure" },
  { value: "monthly", label: "Par mois" },
  { value: "yearly", label: "Par année" },
];

const currencies = [
  { value: "CAD", label: "CAD" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

export function JobSalaryFields() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Rémunération</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="salary_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire minimum</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 50000"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="salary_max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire maximum</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 70000"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="salary_currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Devise</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une devise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="salary_period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Période</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une période" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {salaryPeriods.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
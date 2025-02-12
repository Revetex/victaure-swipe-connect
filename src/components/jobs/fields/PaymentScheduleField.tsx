
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function PaymentScheduleField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="payment_schedule"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fréquence de paiement</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value || "monthly"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la fréquence de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Par heure</SelectItem>
                <SelectItem value="daily">Par jour</SelectItem>
                <SelectItem value="weekly">Par semaine</SelectItem>
                <SelectItem value="biweekly">Aux deux semaines</SelectItem>
                <SelectItem value="monthly">Par mois</SelectItem>
                <SelectItem value="project">Par projet</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

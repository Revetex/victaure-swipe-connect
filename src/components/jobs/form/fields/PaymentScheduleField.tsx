
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const paymentSchedules = {
  company: [
    { value: "monthly", label: "Mensuel" },
    { value: "bi-weekly", label: "Bimensuel" },
    { value: "weekly", label: "Hebdomadaire" }
  ],
  individual: [
    { value: "one_time", label: "Paiement unique" },
    { value: "milestone", label: "Par étapes" },
    { value: "hourly", label: "Taux horaire" }
  ]
};

export function PaymentScheduleField() {
  const { control, watch } = useFormContext();
  const missionType = watch("mission_type");

  return (
    <FormField
      name="payment_schedule"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de paiement</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || "select-payment"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-payment" disabled>
                  Sélectionnez le type de paiement
                </SelectItem>
                {(missionType === "individual" ? paymentSchedules.individual : paymentSchedules.company).map((schedule) => (
                  <SelectItem key={schedule.value} value={schedule.value}>
                    {schedule.label}
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

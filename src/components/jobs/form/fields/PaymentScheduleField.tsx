
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const paymentSchedules = {
  company: [
    { id: "monthly", label: "Mensuel" },
    { id: "biweekly", label: "Aux deux semaines" },
    { id: "weekly", label: "Hebdomadaire" }
  ],
  individual: [
    { id: "one_time", label: "Paiement unique" },
    { id: "milestone", label: "Par étapes" },
    { id: "hourly", label: "Taux horaire" }
  ]
};

export function PaymentScheduleField() {
  const { control, watch } = useFormContext();
  const missionType = watch("mission_type");

  return (
    <FormField
      name="payment_schedule"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de paiement</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || (missionType === "individual" ? "one_time" : "monthly")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de paiement" />
              </SelectTrigger>
              <SelectContent>
                {(missionType === "individual" ? paymentSchedules.individual : paymentSchedules.company).map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
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


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const paymentSchedules = {
  company: [
    "Monthly",
    "Bi-weekly",
    "Weekly"
  ],
  individual: [
    "one_time",
    "milestone",
    "hourly"
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
              defaultValue={field.value || (missionType === "individual" ? "one_time" : "Monthly")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de paiement" />
              </SelectTrigger>
              <SelectContent>
                {(missionType === "individual" ? paymentSchedules.individual : paymentSchedules.company).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "one_time" ? "Paiement unique" : 
                     type === "milestone" ? "Par étapes" :
                     type === "hourly" ? "Taux horaire" : type}
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

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

const experienceLevels = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Expert"
];

const contractTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "One-time",
  "Temporary",
  "Internship"
];

const remoteTypes = [
  "On-site",
  "Remote",
  "Hybrid"
];

const paymentTypes = [
  "Hourly",
  "Fixed-price",
  "Monthly",
  "Project-based"
];

export function JobTypeFields() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        name="job_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de mission</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "Contract"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de mission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Mission d'entreprise</SelectItem>
                  <SelectItem value="individual">Mission de particulier</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="contract_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contrat</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "One-time"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de contrat" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="payment_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de paiement</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "Fixed-price"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de paiement" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "Fixed-price" ? "Paiement unique" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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

      <FormField
        name="remote_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de travail</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "On-site"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de travail" />
                </SelectTrigger>
                <SelectContent>
                  {remoteTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="is_urgent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Mission urgente</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
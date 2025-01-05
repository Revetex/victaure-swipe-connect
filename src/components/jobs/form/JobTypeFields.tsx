import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

const experienceLevels = [
  "Débutant",
  "Junior",
  "Intermédiaire",
  "Senior",
  "Lead",
  "Expert"
];

const contractTypes = {
  company: [
    "CDI",
    "CDD",
    "Intérim",
    "Stage",
    "Alternance"
  ],
  individual: [
    "Unique",
    "Durée déterminée",
    "Projet"
  ]
};

const paymentSchedules = {
  company: [
    "Mensuel",
    "Bimensuel",
    "Hebdomadaire"
  ],
  individual: [
    "Unique",
    "Par étape",
    "Horaire"
  ]
};

const remoteTypes = [
  "Sur site",
  "À distance",
  "Hybride"
];

export function JobTypeFields() {
  const { control, watch } = useFormContext();
  const missionType = watch("mission_type");

  return (
    <div className="space-y-6">
      <FormField
        name="mission_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de mission</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "company"}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value || (missionType === "individual" ? "Unique" : "CDI")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de contrat" />
                </SelectTrigger>
                <SelectContent>
                  {(missionType === "individual" ? contractTypes.individual : contractTypes.company).map((type) => (
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
        name="payment_schedule"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de paiement</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || (missionType === "individual" ? "Unique" : "Mensuel")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de paiement" />
                </SelectTrigger>
                <SelectContent>
                  {(missionType === "individual" ? paymentSchedules.individual : paymentSchedules.company).map((type) => (
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

      {missionType === "company" && (
        <FormField
          name="experience_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau d'expérience requis</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value || "Intermédiaire"}>
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
      )}

      <FormField
        name="remote_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de travail</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "Sur site"}>
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
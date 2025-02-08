
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { provinces } from "@/hooks/data/provinces";

const experienceLevels = [
  "Entry Level",
  "Junior (1-3 years)",
  "Intermediate (3-5 years)",
  "Senior (5+ years)",
  "Lead",
  "Expert"
];

const contractTypes = {
  company: [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Seasonal"
  ],
  individual: [
    "One-time",
    "Fixed-duration",
    "Project-based",
    "Consulting"
  ]
};

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

const remoteTypes = [
  "On-site",
  "Remote",
  "Hybrid",
  "Flexible"
];

const languageRequirements = [
  "English Only",
  "French Only",
  "Bilingual (English/French)",
  "Either English or French",
  "Multilingual"
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
                    <SelectItem key={province.name} value={province.name}>
                      {province.name}
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
        name="language_requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exigences linguistiques</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "English Only"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez les exigences linguistiques" />
                </SelectTrigger>
                <SelectContent>
                  {languageRequirements.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
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
        name="contract_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contrat</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || (missionType === "individual" ? "One-time" : "Full-time")}>
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

      {missionType === "company" && (
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
      )}

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

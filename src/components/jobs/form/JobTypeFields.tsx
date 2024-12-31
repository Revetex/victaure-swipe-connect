import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  "Temporary",
  "Internship"
];

const remoteTypes = [
  "On-site",
  "Remote",
  "Hybrid"
];

export function JobTypeFields() {
  return (
    <div className="space-y-4">
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
          </FormItem>
        )}
      />

      <FormField
        name="contract_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contrat</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || "Full-time"}>
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
          </FormItem>
        )}
      />
    </div>
  );
}
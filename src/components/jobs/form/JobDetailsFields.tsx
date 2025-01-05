import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function JobDetailsFields() {
  return (
    <div className="space-y-4">
      <FormField
        name="experience_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Niveau d'expérience</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="entry">Débutant</SelectItem>
                <SelectItem value="mid-level">Intermédiaire</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="remote_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de travail</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="on-site">Sur place</SelectItem>
                <SelectItem value="hybrid">Hybride</SelectItem>
                <SelectItem value="remote">À distance</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="contract_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contrat</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="full-time">Temps plein</SelectItem>
                <SelectItem value="part-time">Temps partiel</SelectItem>
                <SelectItem value="contract">Contrat</SelectItem>
                <SelectItem value="internship">Stage</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
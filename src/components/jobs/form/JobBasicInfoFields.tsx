import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function JobBasicInfoFields() {
  return (
    <div className="space-y-4">
      <FormField
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de la mission</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Développeur Full Stack React" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Description détaillée de la mission" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localisation</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Montréal, QC" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
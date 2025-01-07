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
            <FormLabel>Titre du poste</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Développeur Full Stack" />
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
              <Textarea {...field} placeholder="Description détaillée du poste" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
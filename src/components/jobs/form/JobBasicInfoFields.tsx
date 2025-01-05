import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export interface JobBasicInfoFieldsProps {
  title?: string;
  description?: string;
  budget?: string;
  location?: string;
  onChange?: (values: { [key: string]: string }) => void;
}

export function JobBasicInfoFields({ onChange }: JobBasicInfoFieldsProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de la mission</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Développeur Full Stack React/Node.js" 
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.({ title: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez la mission en détail..."
                className="min-h-[100px]"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.({ description: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Budget (CAD)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Ex: 500" 
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.({ budget: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localisation</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Montréal, QC" 
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.({ location: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
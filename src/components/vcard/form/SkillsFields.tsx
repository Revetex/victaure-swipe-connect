import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface SkillsFieldsProps {
  form: UseFormReturn<{
    skills?: string[];
    full_name?: string;
    phone?: string;
  }>;
}

export function SkillsFields({ form }: SkillsFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Compétences</FormLabel>
            <Input
              {...field}
              placeholder="Entrez vos compétences (séparées par des virgules)"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
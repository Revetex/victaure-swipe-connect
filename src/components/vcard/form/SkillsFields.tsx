import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SkillEditor } from "@/components/skills/SkillEditor";

interface SkillsFieldsProps {
  form: UseFormReturn<any>;
}

export function SkillsFields({ form }: SkillsFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="skills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Compétences</FormLabel>
          <SkillEditor
            skills={field.value || []}
            onChange={field.onChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
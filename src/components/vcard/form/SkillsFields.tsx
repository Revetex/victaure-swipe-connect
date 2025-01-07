import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function SkillsFields() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <Input
              {...field}
              placeholder="Enter your skills (comma separated)"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
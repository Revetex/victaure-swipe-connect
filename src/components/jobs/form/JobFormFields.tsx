import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { JobFormValues } from "./JobFormSchema";
import { JobCategoryFields } from "./JobCategoryFields";
import { JobTypeFields } from "./JobTypeFields";

interface JobFormFieldsProps {
  form: UseFormReturn<JobFormValues>;
}

export function JobFormFields({ form }: JobFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de la mission</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Développeur React Senior" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez la mission en détail..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget (CAD)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localisation</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Montréal, QC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JobCategoryFields
          category={form.watch("category")}
          subcategory={form.watch("subcategory")}
          onChange={(field, value) => form.setValue(field as any, value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JobTypeFields
          contractType={form.watch("contract_type")}
          experienceLevel={form.watch("experience_level")}
          onChange={(field, value) => form.setValue(field as any, value)}
        />
      </div>
    </>
  );
}
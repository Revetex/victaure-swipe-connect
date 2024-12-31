import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobCompanyFields } from "./form/JobCompanyFields";
import { JobSalaryFields } from "./form/JobSalaryFields";
import { JobDetailsFields } from "./form/JobDetailsFields";
import { jobFormSchema, defaultValues, type JobFormValues } from "./form/jobFormSchema";
import { useJobFormSubmit } from "./form/useJobFormSubmit";

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const { handleSubmit } = useJobFormSubmit(onSuccess);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <JobBasicInfoFields 
            title={form.watch("title") || ""}
            description={form.watch("description") || ""}
            budget={form.watch("budget")?.toString() || ""}
            location={form.watch("location") || ""}
            onChange={(values) => {
              Object.entries(values).forEach(([key, value]) => {
                form.setValue(key as keyof JobFormValues, value);
              });
            }}
          />
          
          <JobTypeFields />
          
          <JobCategoryFields 
            category={form.watch("category") || ""}
            onChange={(values) => {
              Object.entries(values).forEach(([key, value]) => {
                form.setValue(key as keyof JobFormValues, value);
              });
            }}
          />
          
          {form.watch("mission_type") === "company" && (
            <>
              <JobCompanyFields />
              <JobSalaryFields />
            </>
          )}
          
          <JobDetailsFields />
          
          <Button type="submit" className="w-full">
            Créer la mission
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
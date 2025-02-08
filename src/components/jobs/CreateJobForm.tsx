
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
import { jobFormSchema, defaultValues } from "./form/jobFormSchema";
import { useJobFormSubmit } from "./form/useJobFormSubmit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const form = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const { handleSubmit, isSubmitting } = useJobFormSubmit(onSuccess);

  useEffect(() => {
    // Récupérer les données importées du localStorage
    const importedData = localStorage.getItem('import_job_data');
    if (importedData) {
      const jobData = JSON.parse(importedData);
      // Remplir le formulaire avec les données importées
      Object.entries(jobData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
      // Nettoyer le localStorage
      localStorage.removeItem('import_job_data');
    }
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle mission</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <JobBasicInfoFields />
              <JobTypeFields />
              <JobCategoryFields />
              
              {form.watch("mission_type") === "company" && (
                <>
                  <JobCompanyFields />
                  <JobSalaryFields />
                </>
              )}
              
              <JobDetailsFields />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Création en cours..." : "Créer la mission"}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

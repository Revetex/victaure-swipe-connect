import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobCompanyFields } from "./form/JobCompanyFields";
import { JobSalaryFields } from "./form/JobSalaryFields";
import { JobDetailsFields } from "./form/JobDetailsFields";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const jobFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  budget: z.string().transform((val) => Number(val)), // Transform string to number
  location: z.string().min(1, "La localisation est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  subcategory: z.string().optional(),
  contract_type: z.string().min(1, "Le type de contrat est requis"),
  experience_level: z.string().min(1, "Le niveau d'expérience est requis"),
  remote_type: z.string().min(1, "Le type de travail est requis"),
  required_skills: z.array(z.string()).optional(),
  preferred_skills: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  company_name: z.string().optional(),
  company_logo: z.string().optional(),
  company_website: z.string().optional(),
  company_description: z.string().optional(),
  salary_min: z.number().min(0, "Le salaire minimum doit être positif"),
  salary_max: z.number().min(0, "Le salaire maximum doit être positif"),
  salary_currency: z.string().default("CAD"),
  salary_period: z.string().default("yearly"),
  benefits: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  qualifications: z.array(z.string()).optional(),
  job_type: z.string().min(1, "Le type de mission est requis"),
  payment_type: z.string().min(1, "Le type de paiement est requis"),
  is_urgent: z.boolean().default(false),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

const defaultValues: Partial<JobFormValues> = {
  contract_type: "One-time",
  experience_level: "Mid-Level",
  remote_type: "on-site",
  required_skills: [],
  preferred_skills: [],
  salary_currency: "CAD",
  salary_period: "fixed",
  benefits: [],
  responsibilities: [],
  qualifications: [],
  job_type: "individual",
  payment_type: "Fixed-price",
  is_urgent: false,
};

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const navigate = useNavigate();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer une mission");
        return;
      }

      const { error } = await supabase.from("jobs").insert({
        ...data,
        budget: Number(data.budget), // Ensure budget is a number
        employer_id: user.id,
        status: "open",
      });

      if (error) throw error;

      toast.success("Mission créée avec succès");
      onSuccess?.();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Erreur lors de la création de la mission");
    }
  };

  const formValues = form.watch();

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <JobBasicInfoFields 
            title={formValues.title || ""}
            description={formValues.description || ""}
            budget={formValues.budget?.toString() || ""}
            location={formValues.location || ""}
            onChange={(values) => {
              Object.entries(values).forEach(([key, value]) => {
                form.setValue(key as keyof JobFormValues, value);
              });
            }}
          />
          <JobCategoryFields 
            category={formValues.category || ""}
            subcategory={formValues.subcategory}
            onChange={(values) => {
              Object.entries(values).forEach(([key, value]) => {
                form.setValue(key as keyof JobFormValues, value);
              });
            }}
          />
          <JobTypeFields />
          <JobCompanyFields />
          <JobSalaryFields />
          <JobDetailsFields />
          
          <Button type="submit" className="w-full">
            Créer la mission
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
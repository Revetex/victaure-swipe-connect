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
  budget: z.string().transform((val) => Number(val)),
  location: z.string().min(1, "La localisation est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  subcategory: z.string().optional(),
  mission_type: z.enum(["company", "individual"]).default("company"),
  contract_type: z.string().min(1, "Le type de contrat est requis"),
  experience_level: z.string().optional(),
  remote_type: z.string().min(1, "Le type de travail est requis"),
  payment_schedule: z.string().min(1, "Le type de paiement est requis"),
  is_urgent: z.boolean().default(false),
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
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

const defaultValues: JobFormValues = {
  title: "",
  description: "",
  budget: 0,
  location: "",
  category: "",
  mission_type: "company",
  contract_type: "Full-time",
  experience_level: "Mid-Level",
  remote_type: "on-site",
  required_skills: [],
  preferred_skills: [],
  salary_currency: "CAD",
  salary_period: "yearly",
  benefits: [],
  responsibilities: [],
  qualifications: [],
  is_urgent: false,
  payment_schedule: "Monthly",
  salary_min: 0,
  salary_max: 0,
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

      const jobData = {
        ...data,
        employer_id: user.id,
        status: "open",
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        budget: Number(data.budget),
        salary_min: Number(data.salary_min),
        salary_max: Number(data.salary_max),
      };

      const { error } = await supabase.from("jobs").insert(jobData);

      if (error) throw error;

      toast.success("Mission créée avec succès");
      onSuccess?.();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Erreur lors de la création de la mission");
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const jobFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  budget: z.string().min(1, "Le budget est requis"),
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
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

const defaultValues: Partial<JobFormValues> = {
  contract_type: "Full-time",
  experience_level: "Mid-Level",
  remote_type: "on-site",
  required_skills: [],
  preferred_skills: [],
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
        title: data.title,
        description: data.description,
        budget: parseFloat(data.budget),
        location: data.location,
        category: data.category,
        subcategory: data.subcategory,
        contract_type: data.contract_type,
        experience_level: data.experience_level,
        remote_type: data.remote_type,
        required_skills: data.required_skills,
        preferred_skills: data.preferred_skills,
        latitude: data.latitude,
        longitude: data.longitude,
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

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <JobBasicInfoFields 
            title={form.watch("title")}
            description={form.watch("description")}
            budget={form.watch("budget")}
            location={form.watch("location")}
            onChange={(values) => {
              Object.entries(values).forEach(([key, value]) => {
                form.setValue(key as keyof JobFormValues, value as string);
              });
            }}
          />
          <JobCategoryFields 
            category={form.watch("category")}
            subcategory={form.watch("subcategory")}
            onChange={(values) => {
              Object.entries(values).forEach(([key, value]) => {
                form.setValue(key as keyof JobFormValues, value as string);
              });
            }}
          />
          <JobTypeFields />
          
          <Button type="submit" className="w-full">
            Créer la mission
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
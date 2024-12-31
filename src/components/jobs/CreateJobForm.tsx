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

type JobFormValues = z.infer<typeof jobFormSchema>;

const defaultValues: Partial<JobFormValues> = {
  contract_type: "Full-time",
  experience_level: "Mid-Level",
  remote_type: "On-site",
  required_skills: [],
  preferred_skills: [],
};

export function CreateJobForm() {
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
        employer_id: user.id,
        budget: parseFloat(data.budget),
        status: "open",
      });

      if (error) throw error;

      toast.success("Mission créée avec succès");
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
          <JobBasicInfoFields />
          <JobCategoryFields />
          <JobTypeFields />
          
          <Button type="submit" className="w-full">
            Créer la mission
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
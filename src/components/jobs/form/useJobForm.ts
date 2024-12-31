import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobFormSchema, JobFormValues } from "./JobFormSchema";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseJobFormProps {
  initialData?: Job;
  onSuccess: () => void;
}

export function useJobForm({ initialData, onSuccess }: UseJobFormProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      budget: initialData.budget.toString(),
      location: initialData.location,
      category: initialData.category,
      subcategory: initialData.subcategory || "",
      contract_type: initialData.contract_type,
      experience_level: initialData.experience_level as "Entry-Level" | "Mid-Level" | "Senior" | "Expert" | "Lead",
    } : {
      title: "",
      description: "",
      budget: "",
      location: "",
      category: "",
      subcategory: "",
      contract_type: "",
      experience_level: "Mid-Level",
    },
  });

  const onSubmit = async (values: JobFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer une mission");
        return;
      }

      const jobData = {
        title: values.title,
        description: values.description,
        budget: parseFloat(values.budget),
        location: values.location,
        employer_id: user.id,
        category: values.category,
        subcategory: values.subcategory,
        contract_type: values.contract_type,
        experience_level: values.experience_level,
      };

      if (initialData) {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', initialData.id);

        if (error) {
          console.error('Error updating job:', error);
          throw error;
        }
        toast.success("Mission mise à jour avec succès");
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([jobData]);

        if (error) {
          console.error('Error creating job:', error);
          throw error;
        }
        toast.success("Mission créée avec succès");
      }

      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error submitting job:', error);
      toast.error("Une erreur est survenue lors de la soumission");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
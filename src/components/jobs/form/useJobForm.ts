import { useForm } from "react-hook-form";
import { JobFormSchema, JobFormValues } from "./JobFormSchema";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseJobFormProps {
  initialData?: Job;
  onSuccess: () => void;
}

export function useJobForm({ initialData, onSuccess }: UseJobFormProps) {
  const form = useForm<JobFormValues>({
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      budget: initialData.budget?.toString() || "",
      location: initialData.location,
      category: initialData.category,
      subcategory: initialData.subcategory || "",
      contract_type: initialData.contract_type,
      experience_level: initialData.experience_level,
    } : {
      title: "",
      description: "",
      budget: "",
      location: "",
      category: "",
      subcategory: "",
      contract_type: "",
      experience_level: "Mid-Level",
    }
  });

  const onSubmit = async (values: JobFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const jobData = {
        ...values,
        budget: parseFloat(values.budget),
        employer_id: user.id,
      };

      if (initialData) {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([jobData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error("Une erreur est survenue lors de la sauvegarde");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { JobFormValues } from "./jobFormSchema";

export function useJobFormSubmit(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('jobs')
        .insert({
          ...data,
          employer_id: user.id,
        });

      if (error) throw error;

      toast.success("Mission créée avec succès");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error("Erreur lors de la création de la mission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
import { supabase } from "@/integrations/supabase/client";
import { JobFormValues } from "./jobFormSchema";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useJobFormSubmit = (onSuccess?: () => void) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer une mission");
        return;
      }

      console.log("Submitting job data:", data);

      // Insérer la mission
      const { error } = await supabase
        .from("jobs")
        .insert({
          ...data,
          employer_id: user.id,
          status: "open",
        });

      if (error) {
        console.error("Error creating job:", error);
        throw error;
      }

      toast.success("Mission créée avec succès");
      onSuccess?.();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error in job submission:", error);
      toast.error("Erreur lors de la création de la mission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
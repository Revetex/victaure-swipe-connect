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

      console.log("Données du formulaire:", data);

      // S'assurer que le budget est un nombre
      const budget = typeof data.budget === 'string' ? parseFloat(data.budget) : data.budget;

      // Préparer les données pour l'insertion
      const jobData = {
        title: data.title,
        description: data.description,
        budget: budget,
        location: data.location,
        employer_id: user.id,
        status: "open",
        category: data.category || 'Technology',
        contract_type: data.contract_type || 'full-time',
        experience_level: data.experience_level || 'mid-level',
        company_name: data.company_name || '',
        company_description: data.company_description || '',
        company_website: data.company_website || '',
        mission_type: data.mission_type || 'company',
        required_skills: data.required_skills || [],
        remote_type: data.remote_type || 'on-site',
        salary_min: data.salary_min || 0,
        salary_max: data.salary_max || 0,
        salary_currency: data.salary_currency || 'CAD',
        salary_period: data.salary_period || 'yearly',
        benefits: data.benefits || [],
        responsibilities: data.responsibilities || [],
        qualifications: data.qualifications || [],
        payment_schedule: data.payment_schedule || 'monthly',
        is_urgent: data.is_urgent || false
      };

      // Insérer la mission
      const { error } = await supabase
        .from("jobs")
        .insert(jobData);

      if (error) {
        console.error("Erreur lors de la création de la mission:", error);
        throw error;
      }

      toast.success("Mission créée avec succès");
      onSuccess?.();
      navigate("/marketplace");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur lors de la création de la mission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
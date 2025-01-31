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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer une mission");
        return;
      }

      // Get the category name from the job_categories table
      const { data: categoryData, error: categoryError } = await supabase
        .from('job_categories')
        .select('name')
        .eq('id', data.category)
        .single();

      if (categoryError) {
        console.error("Error fetching category:", categoryError);
        toast.error("Erreur lors de la récupération de la catégorie");
        return;
      }

      if (!categoryData) {
        console.error("Category not found");
        toast.error("Catégorie non trouvée");
        return;
      }

      // Get the subcategory name if one was selected
      let subcategoryName = "";
      if (data.subcategory) {
        const { data: subcategoryData, error: subcategoryError } = await supabase
          .from('job_subcategories')
          .select('name')
          .eq('id', data.subcategory)
          .single();

        if (subcategoryError) {
          console.error("Error fetching subcategory:", subcategoryError);
        } else if (subcategoryData) {
          subcategoryName = subcategoryData.name;
        }
      }

      const jobData = {
        title: data.title,
        description: data.description,
        budget: Number(data.budget),
        location: data.location,
        employer_id: user.id,
        status: "open",
        category: categoryData.name,
        subcategory: subcategoryName,
        mission_type: data.mission_type,
        contract_type: data.contract_type,
        experience_level: data.experience_level,
        remote_type: data.remote_type,
        payment_schedule: data.payment_schedule,
        is_urgent: data.is_urgent,
        required_skills: data.required_skills || [],
        preferred_skills: data.preferred_skills || [],
        latitude: data.latitude,
        longitude: data.longitude,
        company_name: data.company_name || "",
        company_logo: data.company_logo || "",
        company_website: data.company_website || "",
        company_description: data.company_description || "",
        salary_min: Number(data.salary_min || 0),
        salary_max: Number(data.salary_max || 0),
        salary_currency: data.salary_currency || "CAD",
        salary_period: data.salary_period || "yearly",
        benefits: data.benefits || [],
        responsibilities: data.responsibilities || [],
        qualifications: data.qualifications || []
      };

      console.log("Inserting job with data:", jobData);

      const { error } = await supabase
        .from("jobs")
        .insert(jobData);

      if (error) {
        console.error("Error creating job:", error);
        throw error;
      }

      toast.success("Mission créée avec succès");
      onSuccess?.();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Erreur lors de la création de la mission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
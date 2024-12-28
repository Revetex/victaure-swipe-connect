import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobTypeFields } from "./form/JobTypeFields";

interface CreateJobFormProps {
  onSuccess: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
    category: "Technologie",
    subcategory: "",
    contract_type: "Full-time",
    experience_level: "Mid-Level"
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une offre",
          variant: "destructive"
        });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Erreur",
          description: "Impossible de vérifier votre profil",
          variant: "destructive"
        });
        return;
      }

      if (profile.role !== 'employer') {
        toast({
          title: "Erreur",
          description: "Seuls les employeurs peuvent créer des offres",
          variant: "destructive"
        });
        return;
      }

      const { error: insertError } = await supabase.from("jobs").insert({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        location: formData.location,
        employer_id: user.id,
        status: 'open',
        category: formData.category,
        subcategory: formData.subcategory,
        contract_type: formData.contract_type,
        experience_level: formData.experience_level
      });

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: "Votre offre a été créée avec succès"
      });

      onSuccess();
      setFormData({
        title: "",
        description: "",
        budget: "",
        location: "",
        category: "Technologie",
        subcategory: "",
        contract_type: "Full-time",
        experience_level: "Mid-Level"
      });
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'offre",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <JobBasicInfoFields
        title={formData.title}
        description={formData.description}
        budget={formData.budget}
        location={formData.location}
        onChange={handleChange}
      />
      <JobCategoryFields
        category={formData.category}
        subcategory={formData.subcategory}
        onChange={handleChange}
      />
      <JobTypeFields
        contractType={formData.contract_type}
        experienceLevel={formData.experience_level}
        onChange={handleChange}
      />
      <Button type="submit" className="w-full">
        Créer l'offre
      </Button>
    </form>
  );
}
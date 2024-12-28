import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { Loader2 } from "lucide-react";

interface CreateJobFormProps {
  onSuccess: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une mission",
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
          description: "Seuls les employeurs peuvent créer des missions",
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
        description: "Votre mission a été créée avec succès"
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
        description: "Une erreur est survenue lors de la création de la mission",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
        <JobBasicInfoFields
          title={formData.title}
          description={formData.description}
          budget={formData.budget}
          location={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
        <JobCategoryFields
          category={formData.category}
          subcategory={formData.subcategory}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
        <JobTypeFields
          contractType={formData.contract_type}
          experienceLevel={formData.experience_level}
          onChange={handleChange}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-victaure-blue hover:bg-victaure-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer la mission"
        )}
      </Button>
    </form>
  );
}
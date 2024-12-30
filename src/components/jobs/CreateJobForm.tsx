import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
    category: "Technology",
    subcategory: "",
    contract_type: "Full-time",
    experience_level: "Mid-Level",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase.from("jobs").insert({
        ...formData,
        budget: parseFloat(formData.budget),
        employer_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Mission créée avec succès",
      });

      onSuccess?.();

      // Reset form
      setFormData({
        title: "",
        description: "",
        budget: "",
        location: "",
        category: "Technology",
        subcategory: "",
        contract_type: "Full-time",
        experience_level: "Mid-Level",
        latitude: null,
        longitude: null,
      });
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la mission",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une nouvelle mission</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer la mission"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
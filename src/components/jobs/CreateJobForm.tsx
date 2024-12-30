import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidCategory } from "@/types/job";

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
    province: "Québec",
    category: "Technologie",
    subcategory: "",
    contract_type: "CDI",
    experience_level: "Intermédiaire (3-5 ans)",
    images: [] as File[],
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (!isValidCategory(formData.category)) {
        throw new Error("Catégorie invalide");
      }

      // Upload images if any
      const imageUrls = [];
      if (formData.images.length > 0) {
        for (const image of formData.images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const { error: uploadError, data } = await supabase.storage
            .from('jobs')
            .upload(`images/${fileName}`, image);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de télécharger l'image",
            });
            continue;
          }
          
          if (data) {
            const { data: { publicUrl } } = supabase.storage
              .from('jobs')
              .getPublicUrl(`images/${fileName}`);
            imageUrls.push(publicUrl);
          }
        }
      }

      const { error } = await supabase.from("jobs").insert({
        ...formData,
        budget: parseFloat(formData.budget),
        employer_id: user.id,
        images: imageUrls
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
        province: "Québec",
        category: "Technologie",
        subcategory: "",
        contract_type: "CDI",
        experience_level: "Intermédiaire (3-5 ans)",
        images: [],
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
            province={formData.province}
            images={formData.images}
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
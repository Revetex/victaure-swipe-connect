import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidCategory } from "@/types/job";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

interface CreateJobFormProps {
  onSuccess?: () => void;
}

interface JobFormData {
  title: string;
  description: string;
  budget: string;
  location: string;
  category: string;
  subcategory: string;
  contract_type: string;
  experience_level: string;
  images: File[];
  latitude: number | null;
  longitude: number | null;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<JobFormData>({
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      location: "",
      category: "Technologie",
      subcategory: "",
      contract_type: "Full-time",
      experience_level: "Mid-Level",
      images: [],
      latitude: null,
      longitude: null,
    }
  });

  const handleSubmit = async (formData: JobFormData) => {
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

      if (error) {
        console.error("Error creating job:", error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "Mission créée avec succès",
      });

      onSuccess?.();

      // Reset form
      form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <JobBasicInfoFields
              title={form.watch("title")}
              description={form.watch("description")}
              budget={form.watch("budget")}
              location={form.watch("location")}
              images={form.watch("images")}
              onChange={(field, value) => form.setValue(field as any, value)}
            />

            <JobCategoryFields
              category={form.watch("category")}
              subcategory={form.watch("subcategory")}
              onChange={(field, value) => form.setValue(field as any, value)}
            />

            <JobTypeFields form={form} />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer la mission"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
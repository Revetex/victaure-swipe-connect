import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { VCardFormSchema, VCardFormValues } from "./vcard/form/VCardFormSchema";
import { BasicInfoFields } from "./vcard/form/BasicInfoFields";
import { SkillsFields } from "./vcard/form/SkillsFields";
import { useToast } from "./ui/use-toast";

export function VCardCreationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<VCardFormValues>({
    resolver: zodResolver(VCardFormSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      skills: [],
    },
  });

  const onSubmit = async (values: VCardFormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour créer une carte de visite",
        });
        return;
      }

      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching profile:", fetchError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de la vérification du profil",
        });
        return;
      }

      const profileData = {
        full_name: values.full_name,
        email: user.email,
        role: "professional", // Explicitly set to a valid role value
        skills: values.skills,
        phone: values.phone || null,
      };

      console.log("Profile data to be saved:", profileData);

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors de la mise à jour du profil",
          });
          return;
        }
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            ...profileData,
          });

        if (insertError) {
          console.error("Error creating profile:", insertError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Erreur lors de la création du profil",
          });
          return;
        }
      }

      toast({
        title: "Succès",
        description: "Votre carte de visite a été créée avec succès",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoFields />
        <SkillsFields />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création en cours..." : "Créer ma carte de visite"}
        </Button>
      </form>
    </Form>
  );
}
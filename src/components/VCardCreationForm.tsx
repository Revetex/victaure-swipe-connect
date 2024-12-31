import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BasicInfoFields } from "./vcard/form/BasicInfoFields";
import { SkillsFields } from "./vcard/form/SkillsFields";
import { vCardFormSchema, type VCardFormValues } from "./vcard/form/VCardFormSchema";

export function VCardCreationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<VCardFormValues>({
    resolver: zodResolver(vCardFormSchema),
    defaultValues: {
      full_name: "",
      skills: [],
      phone: "",
    },
  });

  const onSubmit = async (values: VCardFormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer un profil");
        return;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

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
          toast.error("Erreur lors de la mise à jour du profil");
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
          toast.error("Erreur lors de la création du profil");
          return;
        }
      }

      toast.success("Profil créé avec succès !");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoFields form={form} />
          <SkillsFields form={form} />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer mon profil"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
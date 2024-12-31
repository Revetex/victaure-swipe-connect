import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  full_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  bio: z.string().optional(),
  phone: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

export function VCardCreationForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      bio: "",
      phone: "",
      skills: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error("Erreur d'authentification");
      }

      if (!user) {
        console.error("No user found");
        throw new Error("Utilisateur non connecté");
      }

      // First, check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // If profile exists, update it instead
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: values.full_name,
            bio: values.bio || null,
            email: user.email,
            role: "professional", // Explicitly set the role to a valid value
            skills: values.skills,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
      } else {
        // If no profile exists, create a new one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: values.full_name,
            bio: values.bio || null,
            email: user.email,
            role: "professional", // Explicitly set the role to a valid value
            skills: values.skills,
          });

        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
      }

      toast({
        title: "Profil créé avec succès",
        description: "Votre VCard a été initialisée",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la création du profil:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer votre profil. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créez votre VCard</CardTitle>
        <CardDescription>
          Remplissez ce formulaire pour initialiser votre profil professionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Parlez-nous de vous et de votre expérience..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer mon profil"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
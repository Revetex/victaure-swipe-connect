import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { UserProfile } from "@/data/mockProfile";

export function useProfile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("No authenticated user");
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        // Si aucun profil n'existe, on en crée un nouveau
        if (!profileData) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              role: 'professional',
            });

          if (insertError) throw insertError;

          // Récupérer le profil nouvellement créé
          const { data: newProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (fetchError) throw fetchError;
          if (!newProfile) throw new Error("Failed to create profile");

          profileData = newProfile;
        }

        const transformedProfile: UserProfile = {
          name: profileData.full_name || '',
          title: profileData.role || 'professional',
          email: profileData.email || '',
          phone: '',
          skills: profileData.skills || [],
          experiences: [],
          certifications: [],
        };

        console.log("Profile loaded:", transformedProfile);
        setProfile(transformedProfile);
        setTempProfile(transformedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger votre profil",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [toast]);

  return { profile, setProfile, tempProfile, setTempProfile, isLoading };
}
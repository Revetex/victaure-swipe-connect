import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Certification, Experience } from "@/types/profile";

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

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch certifications
        const { data: certifications, error: certError } = await supabase
          .from('certifications')
          .select('*')
          .eq('profile_id', user.id);

        if (certError) throw certError;

        // Fetch experiences
        const { data: experiences, error: expError } = await supabase
          .from('experiences')
          .select('*')
          .eq('profile_id', user.id);

        if (expError) throw expError;

        const fullProfile: UserProfile = {
          ...profileData,
          certifications: certifications || [],
          experiences: experiences || [],
        };

        if (!profileData) {
          const defaultProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            full_name: null,
            avatar_url: null,
            role: 'professional',
            bio: null,
            phone: null,
            city: null,
            state: null,
            country: 'Canada',
            skills: [],
            latitude: null,
            longitude: null,
            certifications: [],
            experiences: [],
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile);

          if (insertError) throw insertError;

          setProfile(defaultProfile);
          setTempProfile(defaultProfile);
        } else {
          setProfile(fullProfile);
          setTempProfile(fullProfile);
        }
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
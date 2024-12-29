import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string;
  skills: string[] | null;
  latitude: number | null;
  longitude: number | null;
}

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
          .single();

        if (error) {
          throw error;
        }

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
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile);

          if (insertError) throw insertError;

          setProfile(defaultProfile);
          setTempProfile(defaultProfile);
        } else {
          setProfile(profileData);
          setTempProfile(profileData);
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
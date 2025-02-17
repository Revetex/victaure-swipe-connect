
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/profile";
import { transformToFullProfile, transformToExperience } from "@/utils/profileTransformers";

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

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (!profileData) {
          const defaultProfile = transformToFullProfile({
            id: user.id,
            email: user.email,
            role: 'professional',
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          });

          await supabase.from('profiles').insert(defaultProfile);
          setProfile(defaultProfile);
          setTempProfile(defaultProfile);
          return;
        }

        // Fetch related data
        const [{ data: friendsData }, { data: certifications }, { data: education }, { data: experiences }] = 
          await Promise.all([
            supabase
              .from('profiles')
              .select('id, full_name, avatar_url, online_status, last_seen')
              .in('id', profileData.friends || []),
            supabase
              .from('certifications')
              .select('*')
              .eq('profile_id', user.id),
            supabase
              .from('education')
              .select('*')
              .eq('profile_id', user.id),
            supabase
              .from('experiences')
              .select('*')
              .eq('profile_id', user.id)
          ]);

        const fullProfile = transformToFullProfile({
          ...profileData,
          friends: friendsData || [],
          certifications: certifications || [],
          education: education || [],
          experiences: (experiences || []).map(exp => transformToExperience(exp))
        });

        setProfile(fullProfile);
        setTempProfile(fullProfile);
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

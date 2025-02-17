
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/profile";
import { transformToFullProfile } from "@/utils/profileTransformers";

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

        const fetchData = async () => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          const friends = profileData?.friends || [];
          
          const [{ data: friendsData }, { data: certifications }, { data: education }, { data: experiences }] = 
            await Promise.all([
              supabase
                .from('profiles')
                .select('id, full_name, avatar_url, online_status, last_seen')
                .in('id', friends),
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

          return {
            profile: profileData,
            friends: friendsData || [],
            certifications: certifications || [],
            education: education || [],
            experiences: experiences || []
          };
        };

        const data = await fetchData();
        
        if (!data.profile) {
          const defaultProfile = transformToFullProfile({
            id: user.id,
            email: user.email,
            role: 'professional'
          });

          await supabase.from('profiles').insert(defaultProfile);
          setProfile(defaultProfile);
          setTempProfile(defaultProfile);
        } else {
          const fullProfile = transformToFullProfile({
            ...data.profile,
            friends: data.friends,
            certifications: data.certifications,
            education: data.education,
            experiences: data.experiences
          });

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

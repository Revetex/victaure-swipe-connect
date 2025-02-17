
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Friend, createEmptyProfile } from "@/types/profile";
import { transformDatabaseProfile, transformEducation, transformCertification, transformExperience } from "@/types/profile";

// Définir le type de la réponse de la base de données
interface DatabaseProfile extends Omit<UserProfile, 'friends' | 'certifications' | 'education' | 'experiences'> {
  friends?: string[];
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

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Type assertion pour profileData
        const typedProfileData = profileData as DatabaseProfile;
        const friendsIds = typedProfileData?.friends || [];
        
        const [{ data: friendsData }, { data: certifications }, { data: education }, { data: experiences }] = 
          await Promise.all([
            supabase
              .from('profiles')
              .select('id, full_name, avatar_url, online_status, last_seen')
              .in('id', friendsIds),
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

        const friends: Friend[] = friendsData?.map((friend: any) => ({
          id: friend.id,
          full_name: friend.full_name,
          avatar_url: friend.avatar_url,
          online_status: friend.online_status,
          last_seen: friend.last_seen
        })) || [];

        const baseProfile = createEmptyProfile(user.id, typedProfileData.email);
        const fullProfile: UserProfile = {
          ...baseProfile,
          ...typedProfileData,
          role: (typedProfileData.role as 'professional' | 'business' | 'admin') || 'professional',
          friends,
          certifications: (certifications || []).map(cert => transformCertification(cert)),
          education: (education || []).map(edu => transformEducation(edu)),
          experiences: (experiences || []).map(exp => transformExperience(exp))
        };

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

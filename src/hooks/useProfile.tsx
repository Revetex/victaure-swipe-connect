
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  UserProfile, 
  transformDatabaseProfile,
  transformExperience,
  transformEducation,
  transformCertification
} from "@/types/profile";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useProfile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchWithRetry(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
      try {
        return await fn();
      } catch (error) {
        if (retries > 0) {
          console.log(`Retrying... ${retries} attempts left`);
          await wait(RETRY_DELAY);
          return fetchWithRetry(fn, retries - 1);
        }
        throw error;
      }
    }

    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("No authenticated user");
        }

        // Fetch profile data
        const { data: profileData, error: profileError } = await fetchWithRetry(() =>
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
        );

        if (profileError) throw profileError;

        // Fetch friends data
        const { data: friendsData, error: friendsError } = await fetchWithRetry(() =>
          supabase
            .from('profiles')
            .select('id, full_name, avatar_url, online_status, last_seen')
            .in('id', profileData?.friends || [])
        );

        if (friendsError) throw friendsError;

        // Fetch certifications
        const { data: certifications, error: certError } = await fetchWithRetry(() =>
          supabase
            .from('certifications')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (certError) throw certError;

        // Fetch education
        const { data: education, error: eduError } = await fetchWithRetry(() =>
          supabase
            .from('education')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (eduError) throw eduError;

        // Fetch experiences
        const { data: experiences, error: expError } = await fetchWithRetry(() =>
          supabase
            .from('experiences')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (expError) throw expError;

        if (!profileData) {
          const defaultProfile = transformDatabaseProfile({
            id: user.id,
            email: user.email,
            role: 'professional'
          });

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile);

          if (insertError) {
            console.error('Error creating default profile:', insertError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de créer votre profil",
            });
          } else {
            setProfile(defaultProfile);
            setTempProfile(defaultProfile);
          }
        } else {
          const fullProfile: UserProfile = {
            ...transformDatabaseProfile(profileData),
            friends: friendsData?.map(friend => ({
              id: friend.id,
              full_name: friend.full_name,
              avatar_url: friend.avatar_url,
              online_status: friend.online_status,
              last_seen: friend.last_seen
            })) || [],
            certifications: certifications?.map(cert => transformCertification(cert)) || [],
            education: education?.map(edu => transformEducation(edu)) || [],
            experiences: experiences?.map(exp => transformExperience(exp)) || [],
          };
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

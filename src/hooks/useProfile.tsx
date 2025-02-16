
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/profile";
import { PostgrestResponse } from "@supabase/supabase-js";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useProfile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchWithRetry<T>(fn: () => Promise<PostgrestResponse<T>>, retries = MAX_RETRIES): Promise<PostgrestResponse<T>> {
      try {
        const result = await fn();
        if (result.error) throw result.error;
        return result;
      } catch (error) {
        if (retries > 0) {
          console.log(`Retrying... ${retries} attempts left`);
          await wait(RETRY_DELAY);
          return fetchWithRetry(fn, retries - 1);
        }
        return { data: null, error, count: null, status: 400, statusText: 'error' };
      }
    }

    async function fetchProfile() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!user) {
          console.log("No authenticated user found");
          setIsLoading(false);
          return;
        }

        console.log("Fetching profile for user:", user.id);

        const { data: profileData, error: profileError } = await fetchWithRetry(() =>
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
        );

        if (profileError) {
          throw profileError;
        }

        const { data: certifications } = await fetchWithRetry(() =>
          supabase
            .from('certifications')
            .select('*')
            .eq('profile_id', user.id)
        );

        const { data: education } = await fetchWithRetry(() =>
          supabase
            .from('education')
            .select('*')
            .eq('profile_id', user.id)
        );

        const { data: experiences } = await fetchWithRetry(() =>
          supabase
            .from('experiences')
            .select('*')
            .eq('profile_id', user.id)
        );

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
            online_status: false,
            last_seen: new Date().toISOString(),
            certifications: [],
            education: [],
            experiences: []
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile);

          if (insertError) {
            throw insertError;
          }

          if (mounted) {
            setProfile(defaultProfile);
            setTempProfile(defaultProfile);
          }
        } else {
          if (mounted) {
            const fullProfile: UserProfile = {
              ...profileData as Partial<UserProfile>,
              certifications: certifications || [],
              education: education || [],
              experiences: experiences || []
            } as UserProfile;

            setProfile(fullProfile);
            setTempProfile(fullProfile);
          }
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger votre profil. Réessayez dans quelques instants.",
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [toast]);

  return { profile, setProfile, tempProfile, setTempProfile, isLoading };
}

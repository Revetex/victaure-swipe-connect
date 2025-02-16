
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Certification, Experience, Education } from "@/types/profile";

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
        // D'abord, vérifiez si nous avons un utilisateur authentifié
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!user) {
          console.log("No authenticated user found");
          setIsLoading(false);
          return;
        }

        console.log("Fetching profile for user:", user.id);

        // Récupérer le profil avec retry
        const { data: profileData, error: profileError } = await fetchWithRetry(() =>
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
        );

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        // Récupérer les certifications avec retry
        const { data: certifications, error: certError } = await fetchWithRetry(() =>
          supabase
            .from('certifications')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (certError) throw certError;

        // Récupérer l'éducation avec retry
        const { data: education, error: eduError } = await fetchWithRetry(() =>
          supabase
            .from('education')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (eduError) throw eduError;

        // Récupérer les expériences avec retry
        const { data: experiences, error: expError } = await fetchWithRetry(() =>
          supabase
            .from('experiences')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (expError) throw expError;

        if (!profileData) {
          // Créer un profil par défaut si aucun n'existe
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
            console.error('Error creating default profile:', insertError);
            throw insertError;
          }

          if (mounted) {
            setProfile(defaultProfile);
            setTempProfile(defaultProfile);
          }
        } else {
          // Combiner toutes les données
          const fullProfile: UserProfile = {
            ...profileData,
            certifications: certifications || [],
            education: education || [],
            experiences: experiences || []
          };

          if (mounted) {
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

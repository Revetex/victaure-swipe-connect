
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Certification, Experience, Education, Friend } from "@/types/profile";

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

        // Fetch other related data (certifications, education, experiences)
        const { data: certifications, error: certError } = await fetchWithRetry(() =>
          supabase
            .from('certifications')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (certError) throw certError;

        const { data: education, error: eduError } = await fetchWithRetry(() =>
          supabase
            .from('education')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (eduError) throw eduError;

        const { data: experiences, error: expError } = await fetchWithRetry(() =>
          supabase
            .from('experiences')
            .select('*')
            .eq('profile_id', user.id)
        );

        if (expError) throw expError;

        // Map data to match our interfaces
        const mappedCertifications: Certification[] = certifications?.map(cert => ({
          id: cert.id,
          profile_id: cert.profile_id,
          title: cert.title,
          institution: cert.issuer,
          year: cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : "",
          created_at: cert.created_at,
          updated_at: cert.updated_at,
          credential_url: cert.credential_url,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
          issuer: cert.issuer
        })) || [];

        const mappedFriends: Friend[] = friendsData?.map(friend => ({
          id: friend.id,
          full_name: friend.full_name,
          avatar_url: friend.avatar_url,
          online_status: friend.online_status,
          last_seen: friend.last_seen
        })) || [];

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
            friends: [],
            certifications: [],
            education: [],
            experiences: []
          };

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
            ...profileData,
            friends: mappedFriends,
            certifications: mappedCertifications,
            education: education || [],
            experiences: experiences || [],
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

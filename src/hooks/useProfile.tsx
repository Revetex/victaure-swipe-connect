
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Experience, Education, Certification } from "@/types/profile";
import { PostgrestResponse } from "@supabase/supabase-js";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to transform dates
const transformExperience = (exp: any): Experience => ({
  ...exp,
  created_at: exp.created_at ? new Date(exp.created_at) : undefined,
  updated_at: exp.updated_at ? new Date(exp.updated_at) : undefined,
  start_date: exp.start_date ? new Date(exp.start_date) : null,
  end_date: exp.end_date ? new Date(exp.end_date) : null
});

const transformEducation = (edu: any): Education => ({
  ...edu,
  created_at: edu.created_at ? new Date(edu.created_at) : undefined,
  updated_at: edu.updated_at ? new Date(edu.updated_at) : undefined,
  start_date: edu.start_date ? new Date(edu.start_date) : null,
  end_date: edu.end_date ? new Date(edu.end_date) : null
});

const transformCertification = (cert: any): Certification => ({
  ...cert,
  created_at: cert.created_at ? new Date(cert.created_at) : undefined,
  updated_at: cert.updated_at ? new Date(cert.updated_at) : undefined,
  issue_date: cert.issue_date ? new Date(cert.issue_date) : null,
  expiry_date: cert.expiry_date ? new Date(cert.expiry_date) : null
});

export function useProfile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let mounted = true;

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

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        const { data: certifications } = await supabase
          .from('certifications')
          .select('*')
          .eq('profile_id', user.id);

        const { data: education } = await supabase
          .from('education')
          .select('*')
          .eq('profile_id', user.id);

        const { data: experiences } = await supabase
          .from('experiences')
          .select('*')
          .eq('profile_id', user.id);

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
              certifications: (certifications || []).map(transformCertification),
              education: (education || []).map(transformEducation),
              experiences: (experiences || []).map(transformExperience)
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

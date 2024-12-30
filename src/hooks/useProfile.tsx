import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { UserProfile, Certification, Experience } from "@/types/profile";
import type { Tables, InsertTables } from "@/types/database";

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

        const { data: certifications = [], error: certError } = await supabase
          .from('certifications')
          .select('*')
          .eq('profile_id', user.id);

        if (certError) throw certError;

        const { data: experiences = [], error: expError } = await supabase
          .from('experiences')
          .select('*')
          .eq('profile_id', user.id);

        if (expError) throw expError;

        const mappedCertifications: Certification[] = certifications.map((cert: Tables<'certifications'>) => ({
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
        }));

        if (!profileData) {
          const defaultProfile: InsertTables<'profiles'> = {
            id: user.id,
            email: user.email || '',
            role: 'professional',
            full_name: null,
            avatar_url: null,
            bio: null,
            phone: null,
            city: null,
            state: null,
            country: 'Canada',
            skills: [],
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile);

          if (insertError) throw insertError;

          setProfile(defaultProfile as UserProfile);
          setTempProfile(defaultProfile as UserProfile);
        } else {
          const fullProfile: UserProfile = {
            ...profileData,
            certifications: mappedCertifications,
            experiences: experiences as Experience[],
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
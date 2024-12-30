import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Certification, Experience, Education } from "@/types/profile";

export function useProfile() {
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

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch certifications
        const { data: certifications, error: certError } = await supabase
          .from('certifications')
          .select('*')
          .eq('profile_id', user.id);

        if (certError) throw certError;

        // Fetch education
        const { data: education, error: eduError } = await supabase
          .from('education')
          .select('*')
          .eq('profile_id', user.id);

        if (eduError) throw eduError;

        // Fetch experiences
        const { data: experiences, error: expError } = await supabase
          .from('experiences')
          .select('*')
          .eq('profile_id', user.id);

        if (expError) throw expError;

        // Map certifications to match our interface
        const mappedCertifications: Certification[] = (certifications || []).map(cert => ({
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

        const mappedEducation: Education[] = (education || []).map(edu => ({
          id: edu.id,
          school_name: edu.school_name,
          degree: edu.degree,
          field_of_study: edu.field_of_study,
          start_date: edu.start_date,
          end_date: edu.end_date,
          description: edu.description
        }));

        const fullProfile: UserProfile = {
          ...profileData,
          certifications: mappedCertifications,
          education: mappedEducation,
          experiences: experiences || [],
        };

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
            certifications: [],
            education: [],
            experiences: [],
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile);

          if (insertError) throw insertError;

          setProfile(defaultProfile);
          setTempProfile(defaultProfile);
        } else {
          setProfile(fullProfile);
          setTempProfile(fullProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return { profile, setProfile, tempProfile, setTempProfile, isLoading };
}
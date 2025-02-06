import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VCard } from "@/components/VCard";
import { UserProfile, Experience, Certification } from "@/types/profile";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(`
            *,
            certifications (*),
            education (*),
            experiences (*)
          `)
          .eq("id", id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profileData) {
          toast.error("Profil non trouvé");
          return;
        }

        // Map experiences with proper date handling
        const mappedExperiences: Experience[] = (profileData.experiences || []).map(exp => ({
          ...exp,
          created_at: exp.created_at ? new Date(exp.created_at) : null,
          updated_at: exp.updated_at ? new Date(exp.updated_at) : null,
          start_date: exp.start_date || null,
          end_date: exp.end_date || null
        }));

        // Map certifications with proper field mapping
        const mappedCertifications: Certification[] = (profileData.certifications || []).map(cert => ({
          id: cert.id,
          profile_id: cert.profile_id,
          title: cert.title,
          institution: cert.issuer, // Map issuer to institution
          year: cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : "",
          created_at: cert.created_at,
          updated_at: cert.updated_at,
          credential_url: cert.credential_url || null,
          issue_date: cert.issue_date || null,
          expiry_date: cert.expiry_date || null,
          issuer: cert.issuer,
          description: cert.description || null
        }));

        const formattedProfile: UserProfile = {
          ...profileData,
          experiences: mappedExperiences,
          certifications: mappedCertifications,
          education: profileData.education || []
        };

        setProfile(formattedProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <ReloadIcon className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium">Profil non trouvé</p>
          <p className="text-muted-foreground mt-2">
            Le profil que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return <VCard profile={profile} isPublic />;
}
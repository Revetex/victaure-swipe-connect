import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Certification, Experience } from "@/types/profile";
import { VCard } from "./VCard";
import { toast } from "sonner";
import { ProfilePreview } from "./ProfilePreview";
import { Loader } from "./ui/loader";
import { motion } from "framer-motion";

export function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!id) {
          setError("No profile ID provided");
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            certifications (*),
            education (*),
            experiences (*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          setError("Profile not found");
          return;
        }

        // Check if profile is private
        if (data.privacy_enabled) {
          setError("This profile is private");
          return;
        }

        // Map certifications to include computed fields
        const mappedCertifications: Certification[] = data.certifications?.map((cert: any) => ({
          ...cert,
          institution: cert.issuer,
          year: cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : ""
        })) || [];

        // Map experiences to handle date fields
        const mappedExperiences: Experience[] = data.experiences?.map((exp: any) => ({
          ...exp,
          created_at: new Date(exp.created_at),
          updated_at: new Date(exp.updated_at),
          start_date: exp.start_date,
          end_date: exp.end_date
        })) || [];

        // Create the profile object with properly mapped data
        const mappedProfile: UserProfile = {
          ...data,
          certifications: mappedCertifications,
          experiences: mappedExperiences
        };

        setProfile(mappedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Could not load profile");
        setError("Error loading profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">{error}</h1>
          <p className="text-muted-foreground">
            {error === "This profile is private" 
              ? "The owner of this profile has made it private."
              : "Please try again later or check the profile URL."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {profile && <VCard profile={profile} isPublicView />}
      {profile && (
        <ProfilePreview
          profile={profile}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
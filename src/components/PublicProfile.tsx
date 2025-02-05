import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
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
            certifications (
              id,
              title,
              institution,
              year,
              description,
              credential_url,
              created_at,
              updated_at
            ),
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

        // Transform certifications to match the Certification type
        const transformedProfile = {
          ...data,
          certifications: data.certifications?.map((cert: any) => ({
            id: cert.id,
            profile_id: cert.profile_id,
            title: cert.title,
            institution: cert.issuer || cert.institution,
            year: cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : "",
            created_at: cert.created_at,
            updated_at: cert.updated_at,
            credential_url: cert.credential_url,
            description: cert.description,
            issuer: cert.issuer,
            issue_date: cert.issue_date,
            expiry_date: cert.expiry_date
          })),
          // Transform experiences to match the Experience type
          experiences: data.experiences?.map((exp: any) => ({
            id: exp.id,
            company: exp.company,
            position: exp.position,
            start_date: exp.start_date,
            end_date: exp.end_date,
            description: exp.description,
            created_at: exp.created_at ? new Date(exp.created_at) : null,
            updated_at: exp.updated_at ? new Date(exp.updated_at) : null
          }))
        };

        setProfile(transformedProfile as UserProfile);
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

  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Profile not found</h1>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <VCard onEditStateChange={undefined} onRequestChat={undefined} />
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
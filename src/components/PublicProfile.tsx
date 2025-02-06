import { VCard } from "./VCard";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/profile";
import { toast } from "sonner";

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            experiences (*),
            education (*),
            certifications (*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Profil non trouvé</h1>
        <p className="text-muted-foreground">Ce profil n'existe pas ou a été supprimé.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VCard profile={profile} isPublic />
    </div>
  );
}
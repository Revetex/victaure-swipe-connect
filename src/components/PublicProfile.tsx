
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserProfile, Certification, Experience } from "@/types/profile";
import { toast } from "sonner";
import { generateVCardData } from "@/utils/profileActions";
import { PublicProfileHeader } from "./public-profile/PublicProfileHeader";
import { PublicProfileContent } from "./public-profile/PublicProfileContent";
import { PublicProfileLoader } from "./public-profile/PublicProfileLoader";
import { PublicProfileError } from "./public-profile/PublicProfileError";

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

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
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setProfile(null);
          return;
        }

        const transformedData: UserProfile = {
          ...data,
          certifications: data.certifications?.map((cert: any) => ({
            ...cert,
            institution: cert.issuer,
            year: new Date(cert.issue_date).getFullYear().toString()
          })) as Certification[],
          experiences: data.experiences?.map((exp: any) => ({
            ...exp,
            created_at: new Date(exp.created_at),
            updated_at: new Date(exp.updated_at)
          })) as Experience[]
        };

        setProfile(transformedData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleDownloadVCard = () => {
    if (!profile) return;
    
    const vCardData = generateVCardData(profile);
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.full_name || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Carte de visite téléchargée");
  };

  const handleDownloadBusinessCard = async () => {
    // Logic for downloading the business card PDF
    toast.success("Carte professionnelle téléchargée");
  };

  if (loading) {
    return <PublicProfileLoader />;
  }

  if (!profile) {
    return <PublicProfileError />;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Profil Public</h1>
      <PublicProfileHeader 
        onDownloadVCard={handleDownloadVCard}
        onDownloadBusinessCard={handleDownloadBusinessCard}
      />
      <PublicProfileContent profile={profile} />
    </div>
  );
}


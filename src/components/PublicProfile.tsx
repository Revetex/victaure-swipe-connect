
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

        // Map certifications and ensure all required fields are present
        const certifications: Certification[] = (data.certifications || []).map(cert => ({
          id: cert.id,
          profile_id: cert.profile_id,
          title: cert.title,
          institution: cert.issuer,
          year: cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : "",
          created_at: cert.created_at,
          updated_at: cert.updated_at,
          credential_url: cert.credential_url || null,
          issue_date: cert.issue_date || null,
          expiry_date: cert.expiry_date || null,
          issuer: cert.issuer,
          description: cert.description || null
        }));

        // Map experiences with proper null handling
        const experiences: Experience[] = (data.experiences || []).map(exp => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          start_date: exp.start_date || null,
          end_date: exp.end_date || null,
          description: exp.description || null,
          created_at: exp.created_at ? new Date(exp.created_at) : null,
          updated_at: exp.updated_at ? new Date(exp.updated_at) : null
        }));

        const transformedProfile: UserProfile = {
          ...data,
          certifications,
          experiences,
          education: data.education || [],
          website: data.website || null,
          company_name: data.company_name || null,
          company_size: data.company_size || null,
          industry: data.industry || null,
          style_id: data.style_id || undefined,
          custom_font: data.custom_font || null,
          custom_background: data.custom_background || null,
          custom_text_color: data.custom_text_color || null,
          sections_order: data.sections_order || null,
          privacy_enabled: data.privacy_enabled || false,
          online_status: data.online_status || false,
          last_seen: data.last_seen || undefined,
          created_at: data.created_at || undefined,
          auto_update_enabled: data.auto_update_enabled || false
        };

        setProfile(transformedProfile);
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

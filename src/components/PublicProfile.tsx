import { VCard } from "./VCard";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserProfile, Certification, Experience } from "@/types/profile";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Download, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateVCardData } from "@/utils/profileActions";

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        // Transform the data to match UserProfile type
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
    <div className="container mx-auto px-4 py-8 relative">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadVCard}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <VCard profile={profile} isPublic />
    </div>
  );
}
import { useToast } from "@/hooks/use-toast";
import { generateVCardData } from "@/utils/profileActions";
import { generatePDF, generateBusinessPDF, generateCVPDF } from "@/utils/pdfGenerator";
import type { UserProfile } from "@/types/profile";

export function useVCardHandlers() {
  const { toast } = useToast();

  const handleShare = async (profile: UserProfile) => {
    if (!profile) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.full_name || '',
          text: `Profil professionnel de ${profile.full_name || ''}`,
          url: window.location.href,
        });
        toast({
          title: "Succès",
          description: "Profil partagé avec succès",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de partager le profil",
        });
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadVCard = (profile: UserProfile) => {
    if (!profile) return;
    
    try {
      const vCardData = generateVCardData(profile);
      const blob = new Blob([vCardData], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${profile.full_name?.replace(/\s+/g, '_').toLowerCase() || 'profile'}.vcf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Succès",
        description: "VCard téléchargée avec succès",
      });
    } catch (error) {
      console.error('Error downloading vCard:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger la VCard",
      });
    }
  };

  const handleDownloadPDF = async (profile: UserProfile) => {
    if (!profile) return;
    
    try {
      const doc = await generatePDF(profile);
      doc.save(`${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'vcard'}.pdf`);
      
      toast({
        title: "Succès",
        description: "PDF téléchargé avec succès",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF",
      });
    }
  };

  const handleDownloadBusinessPDF = async (profile: UserProfile) => {
    if (!profile) return;
    
    try {
      const doc = await generateBusinessPDF(profile);
      doc.save(`carte-visite-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'professionnel'}.pdf`);
      
      toast({
        title: "Succès",
        description: "Business PDF téléchargé avec succès",
      });
    } catch (error) {
      console.error('Error generating business PDF:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le Business PDF",
      });
    }
  };

  const handleDownloadCVPDF = async (profile: UserProfile) => {
    if (!profile) return;
    
    try {
      const doc = await generateCVPDF(profile);
      doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'cv'}.pdf`);
      
      toast({
        title: "Succès",
        description: "CV PDF téléchargé avec succès",
      });
    } catch (error) {
      console.error('Error generating CV PDF:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le CV PDF",
      });
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Succès",
        description: "Lien copié dans le presse-papier",
      });
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien",
      });
    }
  };

  return {
    handleShare,
    handleDownloadVCard,
    handleDownloadPDF,
    handleDownloadBusinessPDF,
    handleDownloadCVPDF,
    handleCopyLink,
  };
}

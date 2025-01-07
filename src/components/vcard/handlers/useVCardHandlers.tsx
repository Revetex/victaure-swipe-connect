import { useToast } from "@/hooks/use-toast";
import { generateBusinessCard, generateCV } from "@/utils/pdfGenerator";
import type { UserProfile } from "@/types/profile";
import type { StyleOption } from "../types";

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
    handleCopyLink,
  };
}
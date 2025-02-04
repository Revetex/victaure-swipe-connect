import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { updateProfile } from "@/utils/profileActions";
import { generateBusinessCard } from "@/utils/pdfGenerator";

interface UseVCardHandlersProps {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsPdfGenerating: (isGenerating: boolean) => void;
  onEditStateChange?: (isEditing: boolean) => void;
  selectedStyle: StyleOption;
}

export function useVCardHandlers({
  profile,
  setProfile,
  setIsEditing,
  setIsPdfGenerating,
  onEditStateChange,
  selectedStyle
}: UseVCardHandlersProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = async () => {
    if (!profile) {
      toast.error("Aucun profil à sauvegarder");
      return;
    }

    try {
      setIsProcessing(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Auth error:', userError);
        throw userError;
      }
      
      if (!user) {
        toast.error("Vous devez être connecté pour sauvegarder votre profil");
        return;
      }

      const updatedProfile = {
        ...profile,
        id: user.id,
      };

      await updateProfile(updatedProfile);
      setIsEditing(false);
      if (onEditStateChange) {
        onEditStateChange(false);
      }
      toast.success("Profil mis à jour avec succès");
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || "Erreur lors de la sauvegarde du profil");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadBusinessCard = async () => {
    if (!profile) return;
    setIsPdfGenerating(true);
    try {
      const doc = await generateBusinessCard(profile, selectedStyle);
      doc.save(`carte-visite-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'professionnel'}.pdf`);
      toast.success("Carte de visite générée avec succès");
    } catch (error) {
      console.error('Error generating business card:', error);
      toast.error("Erreur lors de la génération de la carte de visite");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return {
    handleSave,
    handleDownloadBusinessCard,
    isProcessing
  };
}
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { toast } from "sonner";
import { updateProfile } from "@/utils/profileActions";
import { VCardContainer } from "./vcard/VCardContainer";
import { VCardFooter } from "./vcard/VCardFooter";
import { VCardCustomization } from "./vcard/VCardCustomization";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardSectionsManager } from "./vcard/sections/VCardSectionsManager";
import { generateBusinessCard, generateCV } from "@/utils/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedStyle } = useVCardStyle();

  const handleEditToggle = () => {
    if (!profile) {
      toast.error("Aucun profil à éditer");
      return;
    }

    // Only allow editing for professional and employer roles
    if (!['professional', 'employer'].includes(profile.role)) {
      toast.error("Vous n'avez pas les permissions nécessaires pour éditer ce profil");
      return;
    }

    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  const handleSave = async () => {
    if (!profile) {
      toast.error("Aucun profil à sauvegarder");
      return;
    }

    try {
      setIsProcessing(true);
      
      // Get current user to ensure we're authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Auth error:', userError);
        throw userError;
      }
      
      if (!user) {
        toast.error("Vous devez être connecté pour sauvegarder votre profil");
        return;
      }

      // Ensure role is one of the allowed values
      if (!['professional', 'employer', 'admin'].includes(profile.role)) {
        toast.error("Le rôle spécifié n'est pas valide");
        return;
      }

      console.log('Saving profile:', profile);

      // Include custom styling properties in the profile update
      const updatedProfile = {
        ...profile,
        id: user.id,
        custom_font: profile.custom_font || null,
        custom_background: profile.custom_background || null,
        custom_text_color: profile.custom_text_color || null,
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

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  return (
    <VCardContainer 
      isEditing={isEditing} 
      customStyles={{
        font: profile.custom_font,
        background: profile.custom_background,
        textColor: profile.custom_text_color
      }}
    >
      <div className="w-full mx-auto text-gray-900 dark:text-gray-100 px-4 sm:px-6 lg:px-8">
        {isEditing && (
          <VCardCustomization profile={profile} setProfile={setProfile} />
        )}

        <VCardSectionsManager
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          selectedStyle={selectedStyle}
        />

        <VCardFooter
          isEditing={isEditing}
          isPdfGenerating={isPdfGenerating}
          isProcessing={isProcessing}
          selectedStyle={selectedStyle}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
          onDownloadBusinessCard={async () => {
            if (!profile) return;
            setIsPdfGenerating(true);
            try {
              const doc = await generateBusinessCard(profile, selectedStyle);
              doc.save(`carte-visite-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'professionnel'}.pdf`);
              toast.success("Business PDF généré avec succès");
            } catch (error) {
              console.error('Error generating business PDF:', error);
              toast.error("Erreur lors de la génération du Business PDF");
            } finally {
              setIsPdfGenerating(false);
            }
          }}
          onDownloadCV={async () => {
            if (!profile) return;
            setIsPdfGenerating(true);
            try {
              const doc = await generateCV(profile, selectedStyle);
              doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'cv'}.pdf`);
              toast.success("CV PDF généré avec succès");
            } catch (error) {
              console.error('Error generating CV PDF:', error);
              toast.error("Erreur lors de la génération du CV PDF");
            } finally {
              setIsPdfGenerating(false);
            }
          }}
        />
      </div>
    </VCardContainer>
  );
}
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { toast } from "sonner";
import { updateProfile } from "@/utils/profileActions";
import { VCardContainer } from "./vcard/VCardContainer";
import { VCardFooter } from "./vcard/VCardFooter";
import { VCardStyleEditor } from "./vcard/style/VCardStyleEditor";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardSectionsManager } from "./vcard/sections/VCardSectionsManager";
import { generateBusinessCard, generateCV } from "@/utils/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const { selectedStyle } = useVCardStyle();
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      setTempProfile(null);
    } else if (profile) {
      setTempProfile({ ...profile });
    }
    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  const handleCancel = () => {
    setTempProfile(null);
    setIsEditing(false);
    if (onEditStateChange) {
      onEditStateChange(false);
    }
  };

  const handleProfileChange = (updates: Partial<UserProfile>) => {
    if (tempProfile) {
      setTempProfile({ ...tempProfile, ...updates });
    }
  };

  const handleSave = async () => {
    if (!tempProfile) {
      toast.error("Aucun profil à sauvegarder");
      return;
    }

    try {
      setIsAIProcessing(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        toast.error("Vous devez être connecté pour sauvegarder votre profil");
        return;
      }

      // Include the selected style in the profile data
      const profileWithStyle = {
        ...tempProfile,
        style_id: selectedStyle.id
      };

      const { data: aiCorrections, error: aiError } = await supabase.functions.invoke('ai-profile-review', {
        body: { profile: profileWithStyle }
      });

      if (aiError) {
        console.error('AI review error:', aiError);
      }

      if (aiCorrections?.suggestions) {
        const shouldApply = window.confirm(
          "L'IA a détecté quelques améliorations possibles pour votre profil. Voulez-vous les appliquer ?\n\n" +
          "Suggestions :\n" + aiCorrections.suggestions.join("\n")
        );

        if (shouldApply && aiCorrections.correctedProfile) {
          await updateProfile(aiCorrections.correctedProfile);
          setProfile(aiCorrections.correctedProfile);
          toast.success("Profil mis à jour avec les suggestions de l'IA");
        } else {
          await updateProfile(profileWithStyle);
          setProfile(profileWithStyle);
          toast.success("Profil mis à jour sans les suggestions de l'IA");
        }
      } else {
        await updateProfile(profileWithStyle);
        setProfile(profileWithStyle);
        toast.success("Profil mis à jour avec succès");
      }

      setIsEditing(false);
      if (onEditStateChange) {
        onEditStateChange(false);
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || "Erreur lors de la sauvegarde du profil");
    } finally {
      setIsAIProcessing(false);
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  const activeProfile = tempProfile || profile;

  return (
    <VCardContainer 
      isEditing={isEditing} 
      customStyles={{
        font: activeProfile.custom_font,
        background: activeProfile.custom_background,
        textColor: activeProfile.custom_text_color
      }}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {isEditing && (
          <VCardStyleEditor 
            profile={activeProfile}
            onStyleChange={handleProfileChange}
          />
        )}

        <VCardSectionsManager
          profile={activeProfile}
          isEditing={isEditing}
          setProfile={isEditing ? handleProfileChange : setProfile}
          selectedStyle={selectedStyle}
        />

        <VCardFooter
          isEditing={isEditing}
          isPdfGenerating={isPdfGenerating}
          isProcessing={isAIProcessing}
          selectedStyle={selectedStyle}
          onEditToggle={handleEditToggle}
          onCancel={handleCancel}
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
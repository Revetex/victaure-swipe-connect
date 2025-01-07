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
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const { selectedStyle } = useVCardStyle();

  const handleEditToggle = () => {
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
      setIsAIProcessing(true);
      
      // Validate profile data before saving
      if (!profile.full_name?.trim()) {
        toast.error("Le nom complet est requis");
        return;
      }

      // Call the AI assistant to review and correct the profile with retry logic
      let aiCorrections = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const { data, error } = await supabase.functions.invoke('ai-profile-review', {
            body: { profile }
          });
          
          if (!error) {
            aiCorrections = data;
            break;
          }
          
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        } catch (error) {
          console.error('AI review attempt failed:', error);
          retryCount++;
        }
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
          await updateProfile(profile);
          toast.success("Profil mis à jour sans les suggestions de l'IA");
        }
      } else {
        await updateProfile(profile);
        toast.success("Profil mis à jour avec succès");
      }

      setIsEditing(false);
      if (onEditStateChange) {
        onEditStateChange(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Erreur lors de la sauvegarde du profil. Veuillez réessayer.");
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

  return (
    <VCardContainer 
      isEditing={isEditing} 
      customStyles={{
        font: profile.custom_font,
        background: profile.custom_background,
        textColor: profile.custom_text_color
      }}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          isProcessing={isAIProcessing}
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
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { toast } from "sonner";
import { updateProfile } from "@/utils/profileActions";
import { VCardContainer } from "./vcard/VCardContainer";
import { VCardLayout } from "./vcard/layout/VCardLayout";
import { VCardEditingMode } from "./vcard/editing/VCardEditingMode";
import { VCardMobileFooter } from "./vcard/footer/VCardMobileFooter";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardSectionsManager } from "./vcard/sections/VCardSectionsManager";
import { generateBusinessCard, generateCV } from "@/utils/pdfGenerator";
import { useVCardHandlers } from "./vcard/handlers/useVCardHandlers";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const { selectedStyle } = useVCardStyle();
  const { handleShare } = useVCardHandlers();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setShowCustomization(false);
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
      
      if (!profile.full_name?.trim()) {
        toast.error("Le nom complet est requis");
        return;
      }

      await updateProfile(profile);
      toast.success("Profil mis à jour avec succès");
      
      setIsEditing(false);
      setShowCustomization(false);
      if (onEditStateChange) {
        onEditStateChange(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Erreur lors de la sauvegarde du profil");
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
      selectedStyle={selectedStyle}
    >
      <VCardLayout isEditing={isEditing}>
        {isEditing && (
          <VCardEditingMode
            showCustomization={showCustomization}
            setShowCustomization={setShowCustomization}
            onBack={handleEditToggle}
            profile={profile}
            setProfile={setProfile}
          />
        )}

        <VCardSectionsManager
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          selectedStyle={selectedStyle}
        />

        {isEditing && (
          <VCardMobileFooter
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
                toast.success("Carte de visite générée avec succès");
              } catch (error) {
                console.error('Error generating business card:', error);
                toast.error("Erreur lors de la génération de la carte de visite");
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
                toast.success("CV généré avec succès");
              } catch (error) {
                console.error('Error generating CV:', error);
                toast.error("Erreur lors de la génération du CV");
              } finally {
                setIsPdfGenerating(false);
              }
            }}
            onShare={() => profile && handleShare(profile)}
          />
        )}
      </VCardLayout>
    </VCardContainer>
  );
}
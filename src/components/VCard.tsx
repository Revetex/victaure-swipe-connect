import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { toast } from "sonner";
import { styleOptions } from "./vcard/styles";
import { StyleOption } from "./vcard/types";
import { VCardStyleSelector } from "./vcard/VCardStyleSelector";
import { VCardContent } from "./vcard/VCardContent";
import { supabase } from "@/integrations/supabase/client";
import { updateProfile } from "@/utils/profileActions";
import { VCardContainer } from "./vcard/VCardContainer";
import { VCardFooter } from "./vcard/VCardFooter";
import { generateBusinessCard, generateCV } from "@/utils/pdfGenerator";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(styleOptions[0]);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    if (profile?.style_id) {
      const savedStyle = styleOptions.find(style => style.id === profile.style_id);
      if (savedStyle) {
        setSelectedStyle(savedStyle);
      }
    }
  }, [profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      await updateProfile(profile);
      setIsEditing(false);
      if (onEditStateChange) {
        onEditStateChange(false);
      }
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Erreur lors de la sauvegarde du profil");
    }
  };

  const handleStyleSelect = async (style: StyleOption) => {
    setSelectedStyle(style);
    if (!isEditing) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ style_id: style.id })
          .eq('id', profile?.id);

        if (error) throw error;

        if (profile) {
          setProfile({
            ...profile,
            style_id: style.id
          });
        }

        toast.success("Style mis à jour avec succès");
      } catch (error) {
        console.error('Error updating style:', error);
        toast.error("Erreur lors de la mise à jour du style");
      }
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  return (
    <VCardContainer isEditing={isEditing} selectedStyle={selectedStyle}>
      <div className="space-y-8">
        <VCardStyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={handleStyleSelect}
          isEditing={isEditing}
        />

        <VCardHeader
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <VCardContact
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <VCardContent
          profile={profile}
          isEditing={isEditing}
          selectedStyle={selectedStyle}
          setProfile={setProfile}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={() => {
            if (!profile || !newSkill.trim()) return;
            const updatedSkills = [...(profile.skills || []), newSkill.trim()];
            setProfile({ ...profile, skills: updatedSkills });
            setNewSkill("");
          }}
          handleRemoveSkill={(skillToRemove: string) => {
            if (!profile) return;
            const updatedSkills = (profile.skills || []).filter(
              (skill) => skill !== skillToRemove
            );
            setProfile({ ...profile, skills: updatedSkills });
          }}
        />

        <VCardFooter
          isEditing={isEditing}
          isPdfGenerating={isPdfGenerating}
          profile={profile}
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
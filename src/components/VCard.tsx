import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { VCardContent } from "./vcard/VCardContent";
import { useVCardHandlers } from "./vcard/handlers/useVCardHandlers";
import { useProfileHandlers } from "./vcard/handlers/useProfileHandlers";
import { toast } from "sonner";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
}

export function VCard({ onEditStateChange }: VCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { profile, setProfile, tempProfile, setTempProfile, isLoading } = useProfile();
  const { handleShare, handleDownloadVCard, handleDownloadPDF, handleDownloadBusinessPDF, handleDownloadCVPDF, handleCopyLink } = useVCardHandlers();
  const { handleSave, handleApplyChanges } = useProfileHandlers();

  const handleSetIsEditing = (value: boolean) => {
    setIsEditing(value);
    onEditStateChange?.(value);
  };

  const handleProfileUpdate = async () => {
    try {
      await handleSave(tempProfile);
      setProfile(tempProfile);
      handleSetIsEditing(false);
      toast.success("Modifications enregistrées avec succès");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erreur lors de l'enregistrement des modifications");
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile || !tempProfile) {
    return <VCardEmpty />;
  }

  return (
    <VCardContent
      profile={profile}
      tempProfile={tempProfile}
      isEditing={isEditing}
      setProfile={setProfile}
      setTempProfile={setTempProfile}
      setIsEditing={handleSetIsEditing}
      newSkill={newSkill}
      setNewSkill={setNewSkill}
      onShare={() => handleShare(profile)}
      onDownload={() => handleDownloadVCard(profile)}
      onDownloadPDF={() => handleDownloadPDF(profile)}
      onDownloadBusinessPDF={() => handleDownloadBusinessPDF(profile)}
      onDownloadCVPDF={() => handleDownloadCVPDF(profile)}
      onCopyLink={handleCopyLink}
      onSave={handleProfileUpdate}
      onApplyChanges={() => handleApplyChanges(tempProfile, setProfile, handleSetIsEditing)}
    />
  );
}
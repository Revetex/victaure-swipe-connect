import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { VCardContent } from "./vcard/VCardContent";
import { useVCardHandlers } from "./vcard/handlers/useVCardHandlers";
import { useProfileHandlers } from "./vcard/handlers/useProfileHandlers";
import { toast } from "sonner";

export function VCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { profile, setProfile, tempProfile, setTempProfile, isLoading } = useProfile();
  const { handleShare, handleDownloadVCard, handleDownloadPDF, handleDownloadBusinessPDF, handleDownloadCVPDF, handleCopyLink } = useVCardHandlers();
  const { handleSave, handleApplyChanges } = useProfileHandlers();

  const handleProfileUpdate = async (updatedProfile: any) => {
    try {
      setTempProfile(updatedProfile);
      await handleSave();
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
      setIsEditing={setIsEditing}
      newSkill={newSkill}
      setNewSkill={setNewSkill}
      onShare={() => handleShare(profile)}
      onDownload={() => handleDownloadVCard(profile)}
      onDownloadPDF={() => handleDownloadPDF(profile)}
      onDownloadBusinessPDF={() => handleDownloadBusinessPDF(profile)}
      onDownloadCVPDF={() => handleDownloadCVPDF(profile)}
      onCopyLink={handleCopyLink}
      onSave={() => handleProfileUpdate(tempProfile)}
      onApplyChanges={() => handleApplyChanges(tempProfile, setProfile, setIsEditing)}
    />
  );
}
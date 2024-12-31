import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { VCardContent } from "./vcard/VCardContent";
import { useVCardHandlers } from "./vcard/handlers/useVCardHandlers";
import { useProfileHandlers } from "./vcard/handlers/useProfileHandlers";

export function VCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { profile, setProfile, tempProfile, setTempProfile, isLoading } = useProfile();
  const { handleShare, handleDownloadVCard, handleDownloadPDF, handleDownloadBusinessPDF, handleCopyLink } = useVCardHandlers();
  const { handleSave, handleApplyChanges } = useProfileHandlers();

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
      onCopyLink={handleCopyLink}
      onSave={() => handleSave(tempProfile, setProfile, setIsEditing)}
      onApplyChanges={() => handleApplyChanges(tempProfile, setProfile, setIsEditing)}
    />
  );
}
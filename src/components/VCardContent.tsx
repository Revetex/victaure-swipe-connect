import { useState } from "react";
import { VCardHeader } from "@/components/VCardHeader";
import { VCardContact } from "@/components/VCardContact";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardExperiences } from "@/components/VCardExperiences";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardEducation } from "@/components/VCardEducation";
import { CardContent } from "@/components/ui/card";
import { VCardStyleSelector } from "@/components/vcard/VCardStyleSelector";
import { StyleOption } from "@/components/vcard/types";
import { VCardActions } from "@/components/VCardActions";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { generateVCardPDF } from "@/utils/pdfGenerator";
import { UserProfile } from "@/types/profile";

interface VCardContentProps {
  profile: UserProfile;
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
  setProfile: (profile: UserProfile) => void;
  styleOptions: StyleOption[];
}

export function VCardContent({
  profile,
  selectedStyle,
  setSelectedStyle,
  onEditStateChange,
  onRequestChat,
  setProfile,
  styleOptions,
}: VCardContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleEditStateChange = (state: boolean) => {
    setIsEditing(state);
    onEditStateChange?.(state);
  };

  const handleAddSkill = () => {
    if (newSkill && profile.skills) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (profile.skills) {
      setProfile({
        ...profile,
        skills: profile.skills.filter(skill => skill !== skillToRemove),
      });
    }
  };

  return (
    <CardContent className="p-6 space-y-8">
      <div className="relative space-y-8">
        {isEditing && (
          <VCardStyleSelector
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
            styleOptions={styleOptions}
          />
        )}

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

        <div className="space-y-8 pt-6">
          <VCardSkills
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />

          <VCardExperiences
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardCertifications
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </div>

        <VCardActions
          isEditing={isEditing}
          onShare={() => {}}
          onDownload={() => {}}
          onDownloadPDF={() => {}}
          onDownloadBusinessPDF={() => {}}
          onDownloadCVPDF={() => {}}
          onCopyLink={() => {}}
          onSave={() => handleEditStateChange(false)}
          onApplyChanges={() => {}}
          setIsEditing={handleEditStateChange}
        />
      </div>
    </CardContent>
  );
}

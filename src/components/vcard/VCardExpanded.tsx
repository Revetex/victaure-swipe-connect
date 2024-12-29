import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
import { VCardCertifications } from "../VCardCertifications";
import { VCardActions } from "../VCardActions";
import { motion } from "framer-motion";

interface VCardExpandedProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onClose: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardExpanded({
  profile,
  isEditing,
  setProfile,
  newSkill,
  setNewSkill,
  onClose,
  onShare,
  onDownload,
  onDownloadPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardExpandedProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8 mt-6"
    >
      {!isEditing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="grid gap-6 sm:gap-8">
        <VCardContact
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <VCardSkills
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={() => {
            if (newSkill && !profile.skills.includes(newSkill)) {
              setProfile({
                ...profile,
                skills: [...profile.skills, newSkill],
              });
              setNewSkill("");
            }
          }}
          handleRemoveSkill={(skillToRemove: string) => {
            setProfile({
              ...profile,
              skills: profile.skills.filter(
                (skill) => skill !== skillToRemove
              ),
            });
          }}
        />

        <VCardCertifications
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </div>

      <VCardActions
        isEditing={isEditing}
        onShare={onShare}
        onDownload={onDownload}
        onDownloadPDF={onDownloadPDF}
        onCopyLink={onCopyLink}
        onSave={onSave}
        onApplyChanges={onApplyChanges}
      />
    </motion.div>
  );
}
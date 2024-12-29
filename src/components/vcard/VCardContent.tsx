import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "../VCardHeader";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
import { VCardCertifications } from "../VCardCertifications";
import { VCardActions } from "../VCardActions";
import { motion } from "framer-motion";

interface VCardContentProps {
  profile: any;
  tempProfile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setTempProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardContent({
  profile,
  tempProfile,
  isEditing,
  setProfile,
  setTempProfile,
  setIsEditing,
  newSkill,
  setNewSkill,
  onShare,
  onDownload,
  onDownloadPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-2 sm:px-4"
    >
      <Card className="w-full max-w-2xl mx-auto glass-card backdrop-blur-sm bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-900/40 dark:to-gray-900/10 border-indigo-200/20 dark:border-indigo-800/20">
        <CardContent className="p-3 sm:p-6 space-y-6 sm:space-y-8">
          <VCardHeader
            profile={tempProfile}
            isEditing={isEditing}
            setProfile={setTempProfile}
            setIsEditing={setIsEditing}
          />

          <div className="grid gap-6 sm:gap-8">
            <VCardContact
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
            />

            <VCardSkills
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              handleAddSkill={() => {
                if (newSkill && !tempProfile.skills.includes(newSkill)) {
                  setTempProfile({
                    ...tempProfile,
                    skills: [...tempProfile.skills, newSkill],
                  });
                  setNewSkill("");
                }
              }}
              handleRemoveSkill={(skillToRemove: string) => {
                setTempProfile({
                  ...tempProfile,
                  skills: tempProfile.skills.filter((skill) => skill !== skillToRemove),
                });
              }}
            />

            <VCardCertifications
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
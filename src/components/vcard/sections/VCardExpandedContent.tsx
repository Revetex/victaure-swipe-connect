import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VCardContact } from "../../VCardContact";
import { VCardSkills } from "../../VCardSkills";
import { VCardEducation } from "../../VCardEducation";
import { VCardCertifications } from "../../VCardCertifications";
import { VCardActions } from "../../VCardActions";

interface VCardExpandedContentProps {
  isExpanded: boolean;
  isEditing: boolean;
  profile: any;
  setProfile: (profile: any) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardExpandedContent({
  isExpanded,
  isEditing,
  profile,
  setProfile,
  setIsExpanded,
  newSkill,
  setNewSkill,
  onShare,
  onDownload,
  onDownloadPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardExpandedContentProps) {
  if (!isExpanded) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
    >
      {!isEditing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
          className="absolute top-2 right-2 hover:bg-primary/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="grid gap-6">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`glass-card p-4 rounded-lg ${isEditing ? 'border border-primary/20' : ''}`}
        >
          <VCardContact
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`glass-card p-4 rounded-lg ${isEditing ? 'border border-primary/20' : ''}`}
        >
          <VCardSkills
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleAddSkill={() => {
              if (newSkill && !profile.skills?.includes(newSkill)) {
                setProfile({
                  ...profile,
                  skills: [...(profile.skills || []), newSkill],
                });
                setNewSkill("");
              }
            }}
            handleRemoveSkill={(skillToRemove: string) => {
              setProfile({
                ...profile,
                skills: profile.skills?.filter(
                  (skill: string) => skill !== skillToRemove
                ),
              });
            }}
          />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`glass-card p-4 rounded-lg ${isEditing ? 'border border-primary/20' : ''}`}
        >
          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`glass-card p-4 rounded-lg ${isEditing ? 'border border-primary/20' : ''}`}
        >
          <VCardCertifications
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>
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
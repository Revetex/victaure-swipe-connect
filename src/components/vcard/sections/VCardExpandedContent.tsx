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

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="space-y-6 mt-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20"
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
          variants={itemVariants}
          className={`glass-card p-6 rounded-xl backdrop-blur-sm ${
            isEditing ? 'border border-primary/20 shadow-lg' : 'shadow-md'
          } transition-all duration-300 hover:shadow-lg`}
        >
          <VCardContact
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`glass-card p-6 rounded-xl backdrop-blur-sm ${
            isEditing ? 'border border-primary/20 shadow-lg' : 'shadow-md'
          } transition-all duration-300 hover:shadow-lg`}
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
          variants={itemVariants}
          className={`glass-card p-6 rounded-xl backdrop-blur-sm ${
            isEditing ? 'border border-primary/20 shadow-lg' : 'shadow-md'
          } transition-all duration-300 hover:shadow-lg`}
        >
          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`glass-card p-6 rounded-xl backdrop-blur-sm ${
            isEditing ? 'border border-primary/20 shadow-lg' : 'shadow-md'
          } transition-all duration-300 hover:shadow-lg`}
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
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
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
      className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-md overflow-auto"
    >
      {!isEditing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
          className="absolute top-2 right-2 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="grid gap-6 p-6 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <VCardContact
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-6 rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
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
        </div>

        <motion.div
          variants={itemVariants}
          className="glass-card p-6 rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass-card p-6 rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <VCardCertifications
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>

        <VCardActions
          isEditing={isEditing}
          onShare={onShare}
          onDownload={onDownload}
          onDownloadPDF={onDownloadPDF}
          onCopyLink={onCopyLink}
          onSave={onSave}
          onApplyChanges={onApplyChanges}
        />
      </div>
    </motion.div>
  );
}
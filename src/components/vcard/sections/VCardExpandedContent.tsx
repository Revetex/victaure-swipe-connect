import { motion } from "framer-motion";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VCardContact } from "../../VCardContact";
import { VCardSkills } from "../../VCardSkills";
import { VCardEducation } from "../../VCardEducation";
import { VCardCertifications } from "../../VCardCertifications";
import { VCardActions } from "../../VCardActions";
import { VCardSection } from "../../VCardSection";
import { Textarea } from "@/components/ui/textarea";
import { VCardExpandedHeader } from "./expanded/VCardExpandedHeader";
import { VCardExpandedQR } from "./expanded/VCardExpandedQR";

interface VCardExpandedContentProps {
  isExpanded: boolean;
  isEditing: boolean;
  profile: any;
  setProfile: (profile: any) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
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
  setIsEditing,
  newSkill,
  setNewSkill,
  onShare,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
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
      className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md overflow-auto"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <VCardExpandedHeader
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
          <div className="flex gap-4">
            <VCardExpandedQR />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
              <VCardContact
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
            </div>

            <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
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
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
            <VCardSection 
              title="Description" 
              icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            >
              {isEditing ? (
                <Textarea
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Décrivez votre parcours professionnel..."
                  className="min-h-[150px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-300">
                  {profile.bio || "Aucune description disponible"}
                </p>
              )}
            </VCardSection>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
            <VCardEducation
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
            <VCardCertifications
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
          </motion.div>

          <VCardActions
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onShare={onShare}
            onDownload={onDownload}
            onDownloadPDF={onDownloadPDF}
            onDownloadBusinessPDF={onDownloadBusinessPDF}
            onDownloadCVPDF={onDownloadCVPDF}
            onCopyLink={onCopyLink}
            onSave={onSave}
            onApplyChanges={onApplyChanges}
          />
        </div>
      </div>
    </motion.div>
  );
}
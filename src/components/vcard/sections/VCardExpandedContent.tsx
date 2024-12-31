import { motion } from "framer-motion";
import { VCardActions } from "../../VCardActions";
import { VCardExpandedHeader } from "./expanded/VCardExpandedHeader";
import { VCardExpandedGrid } from "./expanded/VCardExpandedGrid";

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
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
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
      <div className="min-h-screen">
        <VCardExpandedHeader 
          profile={profile}
          setIsExpanded={setIsExpanded}
        />
        
        <div className="container mx-auto py-8">
          <VCardExpandedGrid
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
          />

          <div className="mt-8 px-6">
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
        </div>
      </div>
    </motion.div>
  );
}
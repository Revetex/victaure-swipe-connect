import { motion } from "framer-motion";
import { VCardActions } from "@/components/VCardActions";
import { VCardExpandedHeader } from "./expanded/VCardExpandedHeader";
import { VCardExpandedQR } from "./expanded/VCardExpandedQR";
import { VCardExpandedGrid } from "./expanded/VCardExpandedGrid";
import { VCardExpandedBio } from "./expanded/VCardExpandedBio";
import { VCardExpandedEducation } from "./expanded/VCardExpandedEducation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface VCardExpandedContentProps {
  isExpanded: boolean;
  isEditing: boolean;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
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
          <VCardExpandedGrid
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardExpandedBio
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardExpandedEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

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
import { VCardActions } from "@/components/VCardActions";
import { VCardExpandedGrid } from "./expanded/VCardExpandedGrid";
import { VCardExpandedHeader } from "./expanded/VCardExpandedHeader";
import { motion } from "framer-motion";

interface VCardExpandedContentProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
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
  profile,
  isEditing,
  setProfile,
  setIsEditing,
  newSkill,
  setNewSkill,
  isExpanded,
  setIsExpanded,
  onShare,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardExpandedContentProps) {
  return (
    <motion.div 
      className="flex flex-col gap-6 min-h-[calc(100vh-2rem)] sm:min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <VCardExpandedHeader
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        setIsEditing={setIsEditing}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      <VCardExpandedGrid
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
      />

      <div className="mt-auto pt-4">
        <VCardActions
          isEditing={isEditing}
          onShare={onShare}
          onDownload={onDownload}
          onDownloadPDF={onDownloadPDF}
          onDownloadBusinessPDF={onDownloadBusinessPDF}
          onDownloadCVPDF={onDownloadCVPDF}
          onCopyLink={onCopyLink}
          onSave={onSave}
          onApplyChanges={onApplyChanges}
          setIsEditing={setIsEditing}
        />
      </div>
    </motion.div>
  );
}
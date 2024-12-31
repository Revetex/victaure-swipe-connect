import { VCardMainContent } from "./sections/VCardMainContent";
import { VCardExpandedContent } from "./sections/VCardExpandedContent";
import { VCardCompactActions } from "./VCardCompactActions";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  onDownloadBusinessPDF: () => void;
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
  onDownloadBusinessPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-xl ${
          !isExpanded
            ? "bg-gradient-to-br from-white/10 to-white/5 shadow-lg backdrop-blur-md border border-white/10"
            : ""
        }`}
      >
        <div className="relative">
          {!isExpanded && (
            <div className="absolute inset-0 bg-circuit-pattern opacity-5" />
          )}
          <div className="relative p-4 sm:p-6">
            <VCardMainContent
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              setIsEditing={setIsEditing}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />

            {!isExpanded && !isEditing && (
              <VCardCompactActions
                onExpand={() => setIsExpanded(true)}
                onEdit={() => setIsEditing(true)}
                onDownload={onDownload}
                onDownloadPDF={onDownloadPDF}
                onDownloadBusinessPDF={onDownloadBusinessPDF}
              />
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <VCardExpandedContent
            isExpanded={isExpanded}
            isEditing={isEditing}
            profile={profile}
            setProfile={setProfile}
            setIsExpanded={setIsExpanded}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            onShare={onShare}
            onDownload={onDownload}
            onDownloadPDF={onDownloadPDF}
            onCopyLink={onCopyLink}
            onSave={onSave}
            onApplyChanges={onApplyChanges}
          />
        )}
      </AnimatePresence>
    </>
  );
}
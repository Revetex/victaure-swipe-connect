import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "../VCardHeader";
import { motion, AnimatePresence } from "framer-motion";
import { VCardMinimized } from "./VCardMinimized";
import { VCardExpanded } from "./VCardExpanded";

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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-2 sm:px-4"
    >
      <Card className="w-full max-w-2xl mx-auto glass-card backdrop-blur-sm bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-900/40 dark:to-gray-900/10 border-indigo-200/20 dark:border-indigo-800/20 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-3 sm:p-6">
          <VCardHeader
            profile={tempProfile}
            isEditing={isEditing}
            setProfile={setTempProfile}
            setIsEditing={setIsEditing}
          />

          {!isExpanded && !isEditing && (
            <VCardMinimized
              profile={tempProfile}
              onExpand={() => setIsExpanded(true)}
              onEdit={() => setIsEditing(true)}
            />
          )}

          <AnimatePresence>
            {isExpanded && (
              <VCardExpanded
                profile={tempProfile}
                isEditing={isEditing}
                setProfile={setTempProfile}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                onClose={() => setIsExpanded(false)}
                onShare={onShare}
                onDownload={onDownload}
                onDownloadPDF={onDownloadPDF}
                onCopyLink={onCopyLink}
                onSave={onSave}
                onApplyChanges={onApplyChanges}
              />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { VCardMainContent } from "./sections/VCardMainContent";
import { VCardExpandedContent } from "./sections/VCardExpandedContent";
import { VCardCompactActions } from "./VCardCompactActions";
import { VCardActions } from "@/components/VCardActions";

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
    <Card className={`w-full overflow-hidden border-none shadow-lg transition-all duration-300 ${
      !isExpanded ? 'bg-gradient-to-br from-victaure-metal/90 to-victaure-metal/70 backdrop-blur-sm' : 
      'bg-white dark:bg-gray-800'
    }`}>
      <CardContent className={`p-6 ${!isExpanded && 'relative'}`}>
        {!isExpanded && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            <div className="absolute inset-0 border-2 border-white/20 rounded-lg" />
          </div>
        )}
        <div className="space-y-6">
          <VCardMainContent
            profile={tempProfile}
            isEditing={isEditing}
            setProfile={setTempProfile}
            setIsEditing={setIsEditing}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <VCardExpandedContent
                  profile={tempProfile}
                  isEditing={isEditing}
                  setProfile={setTempProfile}
                  newSkill={newSkill}
                  setNewSkill={setNewSkill}
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                  onShare={onShare}
                  onDownload={onDownload}
                  onDownloadPDF={onDownloadPDF}
                  onCopyLink={onCopyLink}
                  onSave={onSave}
                  onApplyChanges={onApplyChanges}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            {isEditing ? (
              <VCardActions
                isEditing={isEditing}
                onShare={onShare}
                onDownload={onDownload}
                onDownloadPDF={onDownloadPDF}
                onCopyLink={onCopyLink}
                onSave={onSave}
                onApplyChanges={onApplyChanges}
              />
            ) : (
              <VCardCompactActions
                onExpand={() => setIsExpanded(true)}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { VCardMainContent } from "./sections/VCardMainContent";
import { VCardExpandedContent } from "./sections/VCardExpandedContent";
import { VCardCompactActions } from "./VCardCompactActions";

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
  onDownloadCVPDF: () => void;
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
  onDownloadCVPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isEditing) setIsExpanded(true);
  }, [isEditing]);

  return (
    <div className="relative">
      <Card className={`w-full max-w-[95mm] mx-auto overflow-hidden border-none shadow-xl transition-all duration-300 ${
        !isExpanded ? 'h-[60mm] bg-gradient-to-br from-victaure-metal/90 to-victaure-metal/70 backdrop-blur-sm ring-1 ring-white/10' : 
        'min-h-screen sm:min-h-0 bg-white dark:bg-gray-800'
      }`}>
        <CardContent className={`p-4 sm:p-6 ${!isExpanded && 'relative'}`}>
          {!isExpanded && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-circuit-pattern opacity-5" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-70" />
              <div className="absolute inset-0 border border-white/30 rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-tr from-victaure-blue/5 to-transparent opacity-50" />
            </div>
          )}
          <div className="space-y-4 sm:space-y-6">
            <VCardMainContent
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              setIsEditing={setIsEditing}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />

            <AnimatePresence mode="sync">
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
                    setIsEditing={setIsEditing}
                    newSkill={newSkill}
                    setNewSkill={setNewSkill}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    onShare={onShare}
                    onDownload={onDownload}
                    onDownloadPDF={onDownloadPDF}
                    onDownloadBusinessPDF={onDownloadBusinessPDF}
                    onDownloadCVPDF={onDownloadCVPDF}
                    onCopyLink={onCopyLink}
                    onSave={onSave}
                    onApplyChanges={onApplyChanges}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {!isExpanded && !isEditing && (
        <VCardCompactActions
          onExpand={() => setIsExpanded(true)}
          onEdit={() => setIsEditing(true)}
          onShare={onShare}
          onDownloadPDF={onDownloadPDF}
          onDownloadBusinessPDF={onDownloadBusinessPDF}
        />
      )}
    </div>
  );
}
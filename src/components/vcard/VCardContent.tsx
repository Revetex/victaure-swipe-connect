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

  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  return (
    <Card className={`w-full max-w-[85.6mm] mx-auto overflow-hidden border-none shadow-xl transition-all duration-300 ${
      !isExpanded ? 'h-[53.98mm] bg-gradient-to-br from-victaure-metal/90 to-victaure-metal/70 backdrop-blur-sm ring-1 ring-white/10' : 
      'bg-white dark:bg-gray-800'
    }`}>
      <CardContent className={`p-6 ${!isExpanded && 'relative'}`}>
        {!isExpanded && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-circuit-pattern opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-70" />
            <div className="absolute inset-0 border border-white/30 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-tr from-victaure-blue/5 to-transparent opacity-50" />
            <div className="absolute top-0 left-1/4 w-32 h-[2px] bg-victaure-blue/20 rounded-full blur-sm" />
            <div className="absolute bottom-0 right-1/4 w-32 h-[2px] bg-victaure-blue/20 rounded-full blur-sm" />
            <div className="absolute -left-10 top-1/2 w-20 h-20 bg-victaure-blue/10 rounded-full blur-2xl" />
            <div className="absolute -right-10 top-1/2 w-20 h-20 bg-victaure-blue/10 rounded-full blur-2xl" />
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
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { VCardMainInfo } from "./sections/VCardMainInfo";
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <Card className={`w-full max-w-xl mx-auto overflow-hidden rounded-xl shadow-2xl transition-all duration-500
      ${isExpanded ? 'scale-100 bg-gradient-to-br from-indigo-900/30 to-purple-900/30' : 'hover:scale-[1.02] bg-gradient-to-br from-indigo-500/10 to-purple-500/10'}
      backdrop-blur-md border border-white/10`}>
      <CardContent className={`p-6 relative transition-all duration-500 ${isExpanded ? 'min-h-[600px]' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? "editing" : "viewing"}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="space-y-6"
          >
            <VCardMainInfo
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              setIsEditing={setIsEditing}
              isExpanded={isExpanded}
            />

            {!isExpanded && !isEditing && (
              <VCardCompactActions
                onExpand={() => setIsExpanded(true)}
                onEdit={() => setIsEditing(true)}
              />
            )}

            <AnimatePresence>
              {isExpanded && (
                <VCardExpandedContent
                  isExpanded={isExpanded}
                  isEditing={isEditing}
                  profile={tempProfile}
                  setProfile={setTempProfile}
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
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
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

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden rounded-xl shadow-lg bg-card">
      <CardContent className="p-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? "editing" : "viewing"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
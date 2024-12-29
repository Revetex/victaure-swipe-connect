import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { VCardHeaderSection } from "./sections/VCardHeader";
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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <VCardHeaderSection
              tempProfile={tempProfile}
              isEditing={isEditing}
              setTempProfile={setTempProfile}
              setIsEditing={setIsEditing}
              isExpanded={isExpanded}
            />

            {!isExpanded && !isEditing && (
              <VCardCompactActions
                onExpand={() => setIsExpanded(true)}
                onEdit={() => setIsEditing(true)}
              />
            )}

            {isExpanded && (
              <VCardExpandedContent
                isEditing={isEditing}
                tempProfile={tempProfile}
                setTempProfile={setTempProfile}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onShare={onShare}
                onDownload={onDownload}
                onDownloadPDF={onDownloadPDF}
                onCopyLink={onCopyLink}
                onSave={onSave}
                onApplyChanges={onApplyChanges}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
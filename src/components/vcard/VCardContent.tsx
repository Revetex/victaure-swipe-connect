import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { VCardMainContent } from "./sections/VCardMainContent";
import { VCardExpandedContent } from "./sections/VCardExpandedContent";
import { VCardCompactActions } from "./VCardCompactActions";
import { toast } from "sonner";

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

  // Automatically expand when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      await onSave();
      toast.success("Modifications enregistrées avec succès");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Erreur lors de l'enregistrement des modifications");
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto overflow-visible border-none shadow-xl transition-all duration-300 ${
      !isExpanded ? 'bg-gradient-to-br from-indigo-600 to-indigo-800' : 
      'min-h-screen sm:min-h-0 bg-gradient-to-br from-indigo-600 to-indigo-800'
    }`}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <VCardMainContent
            profile={tempProfile}
            isEditing={isEditing}
            setProfile={setTempProfile}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />

          <AnimatePresence mode="wait">
            {(isExpanded || isEditing) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-visible"
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
                  onSave={handleSave}
                  onApplyChanges={onApplyChanges}
                />
              </motion.div>
            )}
          </AnimatePresence>

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
      </CardContent>
    </Card>
  );
}
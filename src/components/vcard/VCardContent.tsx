import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "../VCardHeader";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
import { VCardCertifications } from "../VCardCertifications";
import { VCardActions } from "../VCardActions";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Edit2, X } from "lucide-react";

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
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Éditer
              </Button>
            </div>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 sm:space-y-8 mt-6"
              >
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <div className="grid gap-6 sm:gap-8">
                  <VCardContact
                    profile={tempProfile}
                    isEditing={isEditing}
                    setProfile={setTempProfile}
                  />

                  <VCardSkills
                    profile={tempProfile}
                    isEditing={isEditing}
                    setProfile={setTempProfile}
                    newSkill={newSkill}
                    setNewSkill={setNewSkill}
                    handleAddSkill={() => {
                      if (newSkill && !tempProfile.skills.includes(newSkill)) {
                        setTempProfile({
                          ...tempProfile,
                          skills: [...tempProfile.skills, newSkill],
                        });
                        setNewSkill("");
                      }
                    }}
                    handleRemoveSkill={(skillToRemove: string) => {
                      setTempProfile({
                        ...tempProfile,
                        skills: tempProfile.skills.filter(
                          (skill) => skill !== skillToRemove
                        ),
                      });
                    }}
                  />

                  <VCardCertifications
                    profile={tempProfile}
                    isEditing={isEditing}
                    setProfile={setTempProfile}
                  />
                </div>

                <VCardActions
                  isEditing={isEditing}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
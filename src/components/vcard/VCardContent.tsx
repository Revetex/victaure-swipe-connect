import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "../VCardHeader";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
import { VCardCertifications } from "../VCardCertifications";
import { VCardActions } from "../VCardActions";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { VCardContactInfo } from "./VCardContactInfo";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-2 sm:px-4"
    >
      <Card className="w-full max-w-2xl mx-auto glass-card backdrop-blur-sm bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-900/40 dark:to-gray-900/10 border-indigo-200/20 dark:border-indigo-800/20">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <VCardHeader
                profile={tempProfile}
                isEditing={isEditing}
                setProfile={setTempProfile}
                setIsEditing={setIsEditing}
              />

              {!isExpanded && (
                <VCardContactInfo
                  email={tempProfile.email}
                  phone={tempProfile.phone}
                  city={tempProfile.city}
                  state={tempProfile.state}
                />
              )}
            </div>

            {!isExpanded && (
              <div className="shrink-0 sm:ml-4">
                <QRCodeSVG
                  value={window.location.href}
                  size={80}
                  level="H"
                  includeMargin={true}
                  className="bg-white p-1.5 rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>

          {!isExpanded && !isEditing && (
            <VCardCompactActions
              onExpand={() => setIsExpanded(true)}
              onEdit={() => setIsEditing(true)}
            />
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
                    className="absolute top-2 right-2 hover:bg-primary/5"
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
                      if (newSkill && !tempProfile.skills?.includes(newSkill)) {
                        setTempProfile({
                          ...tempProfile,
                          skills: [...(tempProfile.skills || []), newSkill],
                        });
                        setNewSkill("");
                      }
                    }}
                    handleRemoveSkill={(skillToRemove: string) => {
                      setTempProfile({
                        ...tempProfile,
                        skills: tempProfile.skills?.filter(
                          (skill: string) => skill !== skillToRemove
                        ),
                      });
                    }}
                  />

                  <VCardEducation
                    profile={tempProfile}
                    isEditing={isEditing}
                    setProfile={setTempProfile}
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

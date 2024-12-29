import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "../VCardHeader";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
import { VCardCertifications } from "../VCardCertifications";
import { VCardActions } from "../VCardActions";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Edit2, X, Mail, Phone, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
  const [pdfUrl, setPdfUrl] = useState("");

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
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <VCardHeader
                profile={tempProfile}
                isEditing={isEditing}
                setProfile={setTempProfile}
                setIsEditing={setIsEditing}
              />

              {/* Contact info toujours visible */}
              {!isExpanded && (
                <div className="mt-4 space-y-2">
                  {tempProfile.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{tempProfile.email}</span>
                    </div>
                  )}
                  {tempProfile.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{tempProfile.phone}</span>
                    </div>
                  )}
                  {tempProfile.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{tempProfile.city}, {tempProfile.state || 'Canada'}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* QR Code toujours visible */}
            {!isExpanded && (
              <div className="shrink-0">
                <QRCodeSVG
                  value={window.location.href}
                  size={80}
                  level="H"
                  includeMargin={true}
                  className="bg-white p-1 rounded"
                />
              </div>
            )}
          </div>

          {/* Actions compactes quand non expandé */}
          {!isExpanded && !isEditing && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Éditer
              </Button>
            </div>
          )}

          {/* Contenu détaillé */}
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
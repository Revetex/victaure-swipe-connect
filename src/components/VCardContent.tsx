import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "./vcard/VCardHeader";
import { VCardContact } from "./vcard/VCardContact";
import { VCardSkills } from "./vcard/VCardSkills";
import { VCardCertifications } from "./vcard/VCardCertifications";
import { VCardActions } from "./vcard/VCardActions";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { VCardContactInfo } from "./vcard/VCardContactInfo";
import { VCardCompactActions } from "./vcard/VCardCompactActions";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  const sections = [
    {
      id: "contact",
      title: "Contact",
      component: VCardContact,
      props: { profile: tempProfile, isEditing, setProfile: setTempProfile }
    },
    {
      id: "skills",
      title: "Compétences",
      component: VCardSkills,
      props: {
        profile: tempProfile,
        isEditing,
        setProfile: setTempProfile,
        newSkill,
        setNewSkill,
        handleAddSkill: () => {
          if (newSkill && !tempProfile.skills?.includes(newSkill)) {
            setTempProfile({
              ...tempProfile,
              skills: [...(tempProfile.skills || []), newSkill],
            });
            setNewSkill("");
          }
        },
        handleRemoveSkill: (skillToRemove: string) => {
          setTempProfile({
            ...tempProfile,
            skills: tempProfile.skills?.filter(
              (skill: string) => skill !== skillToRemove
            ),
          });
        }
      }
    },
    {
      id: "certifications",
      title: "Certifications et Diplômes",
      component: VCardCertifications,
      props: { profile: tempProfile, isEditing, setProfile: setTempProfile }
    }
  ];

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
                    {sections.map((section) => {
                      const Component = section.component;
                      const isActive = activeSection === section.id;

                      return (
                        <motion.div
                          key={section.id}
                          initial={false}
                          animate={{ height: isActive ? "auto" : "auto" }}
                          className={cn(
                            "overflow-hidden transition-all duration-300",
                            isActive ? "bg-muted/50 rounded-lg p-4" : ""
                          )}
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setActiveSection(isActive ? null : section.id)}
                          >
                            <h3 className="text-lg font-semibold">{section.title}</h3>
                            {!isEditing && (
                              <Button variant="ghost" size="icon">
                                {isActive ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>

                          <AnimatePresence>
                            {(isActive || isEditing) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4"
                              >
                                <Component {...section.props} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
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
      </div>
    </motion.div>
  );
}
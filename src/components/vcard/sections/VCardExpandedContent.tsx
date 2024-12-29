import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
import { VCardCertifications } from "../VCardCertifications";
import { VCardActions } from "../VCardActions";
import { VCardSection } from "./VCardSection";

interface VCardExpandedContentProps {
  isEditing: boolean;
  tempProfile: any;
  setTempProfile: (profile: any) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardExpandedContent({
  isEditing,
  tempProfile,
  setTempProfile,
  newSkill,
  setNewSkill,
  activeSection,
  setActiveSection,
  onShare,
  onDownload,
  onDownloadPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardExpandedContentProps) {
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
          onClick={() => setActiveSection(null)}
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
  );
}
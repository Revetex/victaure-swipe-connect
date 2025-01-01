import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { VCardEducation } from "./VCardEducation";
import { VCardActions } from "./VCardActions";
import { useVCardHandlers } from "./vcard/handlers/useVCardHandlers";
import { useProfileHandlers } from "./vcard/handlers/useProfileHandlers";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
}

export function VCardComponent({ onEditStateChange }: VCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { profile, setProfile, tempProfile, setTempProfile, isLoading } = useProfile();
  const { handleShare, handleDownloadVCard, handleDownloadPDF, handleDownloadBusinessPDF, handleDownloadCVPDF, handleCopyLink } = useVCardHandlers();
  const { handleSave, handleApplyChanges } = useProfileHandlers();

  const handleSetIsEditing = (value: boolean) => {
    setIsEditing(value);
    onEditStateChange?.(value);
  };

  const handleAddSkill = () => {
    if (newSkill && tempProfile && !tempProfile.skills?.includes(newSkill)) {
      setTempProfile({
        ...tempProfile,
        skills: [...(tempProfile.skills || []), newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (tempProfile) {
      setTempProfile({
        ...tempProfile,
        skills: tempProfile.skills?.filter((skill: string) => skill !== skillToRemove) || [],
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (!tempProfile) return;
    try {
      await handleSave();
      setProfile(tempProfile);
      handleSetIsEditing(false);
      toast.success("Modifications enregistrées avec succès");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erreur lors de l'enregistrement des modifications");
    }
  };

  const localHandleApplyChanges = async () => {
    if (!tempProfile) return;
    try {
      await handleApplyChanges();
      toast.success("Changements appliqués avec succès");
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error("Erreur lors de l'application des changements");
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile || !tempProfile) {
    return <VCardEmpty />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-indigo-800">
        <CardContent className="p-6 space-y-8">
          <VCardHeader
            profile={tempProfile}
            isEditing={isEditing}
            setProfile={setTempProfile}
          />

          <VCardContact
            profile={tempProfile}
            isEditing={isEditing}
            setProfile={setTempProfile}
          />

          <AnimatePresence mode="wait">
            <motion.div 
              key={isEditing ? "editing" : "viewing"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 pt-6"
            >
              <VCardSkills
                profile={tempProfile}
                isEditing={isEditing}
                setProfile={setTempProfile}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                handleAddSkill={handleAddSkill}
                handleRemoveSkill={handleRemoveSkill}
              />

              <VCardCertifications
                profile={tempProfile}
                isEditing={isEditing}
                setProfile={setTempProfile}
              />

              <VCardEducation
                profile={tempProfile}
                isEditing={isEditing}
                setProfile={setTempProfile}
              />

              <VCardActions
                isEditing={isEditing}
                onShare={() => handleShare()}
                onDownload={() => handleDownloadVCard()}
                onDownloadPDF={() => handleDownloadPDF()}
                onDownloadBusinessPDF={() => handleDownloadBusinessPDF()}
                onDownloadCVPDF={() => handleDownloadCVPDF()}
                onCopyLink={() => handleCopyLink()}
                onSave={handleProfileUpdate}
                onApplyChanges={localHandleApplyChanges}
                setIsEditing={handleSetIsEditing}
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { VCardComponent as VCard };

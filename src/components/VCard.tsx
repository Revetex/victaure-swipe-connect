
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { toast } from "sonner";
import { VCardContainer } from "./vcard/VCardContainer";
import { VCardHeader } from "./VCardHeader";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardSectionsManager } from "./vcard/sections/VCardSectionsManager";
import { VCardContact } from "./VCardContact";
import { motion } from "framer-motion";
import { useVCardHandlers } from "./vcard/handlers/useVCardHandlers";
import { UserProfile } from "@/types/profile";

interface VCardProps {
  profile?: UserProfile;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
  isPublic?: boolean;
}

export function VCard({ profile: providedProfile, onEditStateChange, onRequestChat, isPublic }: VCardProps) {
  const { profile: fetchedProfile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedStyle } = useVCardStyle();
  
  const activeProfile = providedProfile || fetchedProfile;
  
  const { handleSave, handleDownloadBusinessCard } = useVCardHandlers({
    profile: activeProfile,
    setProfile,
    setIsEditing,
    setIsPdfGenerating,
    onEditStateChange,
    selectedStyle
  });

  const handleEditToggle = () => {
    if (!activeProfile) {
      toast.error("Aucun profil à éditer");
      return;
    }
    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  if (isLoading && !providedProfile) {
    return <VCardSkeleton />;
  }

  if (!activeProfile) {
    return <VCardEmpty />;
  }

  return (
    <VCardContainer isEditing={isEditing}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto rounded-xl relative z-10 mt-16 sm:mt-6 space-y-6"
      >
        <VCardHeader 
          profile={activeProfile}
          isEditing={isEditing && !isPublic}
          setProfile={setProfile}
          isPdfGenerating={isPdfGenerating}
          isProcessing={isProcessing}
          onEditToggle={!isPublic ? handleEditToggle : undefined}
          onSave={handleSave}
          onDownloadBusinessCard={handleDownloadBusinessCard}
        />

        <motion.div 
          className="space-y-6 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VCardContact
            profile={activeProfile}
            isEditing={isEditing && !isPublic}
            setProfile={setProfile}
          />
          
          <VCardSectionsManager
            profile={activeProfile}
            isEditing={isEditing && !isPublic}
            setProfile={setProfile}
            selectedStyle={selectedStyle}
          />
        </motion.div>
      </motion.div>
    </VCardContainer>
  );
}

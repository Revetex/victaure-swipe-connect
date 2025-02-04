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

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedStyle } = useVCardStyle();
  const { handleSave, handleDownloadBusinessCard } = useVCardHandlers({
    profile,
    setProfile,
    setIsEditing,
    setIsPdfGenerating,
    onEditStateChange,
    selectedStyle
  });

  const handleEditToggle = () => {
    if (!profile) {
      toast.error("Aucun profil à éditer");
      return;
    }
    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  return (
    <VCardContainer isEditing={isEditing}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/10 to-transparent" />
          
          <div className="relative">
            <VCardHeader 
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              isPdfGenerating={isPdfGenerating}
              isProcessing={isProcessing}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
              onDownloadBusinessCard={handleDownloadBusinessCard}
            />

            <div className="mt-8 space-y-6">
              <VCardContact
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
              <VCardSectionsManager
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
                selectedStyle={selectedStyle}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </VCardContainer>
  );
}

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
import { generateBio } from "./vcard/bio/VCardBioGenerator";
import { VCardStyleSelector } from "./vcard/VCardStyleSelector";

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

  const handleGenerateBio = async () => {
    if (!activeProfile) return;
    
    try {
      setIsProcessing(true);
      const generatedBio = await generateBio(activeProfile);
      if (generatedBio) {
        setProfile({ ...activeProfile, bio: generatedBio });
        toast.success("Biographie générée avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la bio:", error);
      toast.error("Erreur lors de la génération de la biographie");
    } finally {
      setIsProcessing(false);
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
        className="w-full bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm relative z-10"
      >
        <div className="relative p-3 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5" />
          
          <div className="relative space-y-6">
            {isEditing && !isPublic && (
              <div className="flex justify-end">
                <VCardStyleSelector />
              </div>
            )}
            
            <VCardHeader 
              profile={activeProfile}
              isEditing={isEditing && !isPublic}
              setProfile={setProfile}
              isPdfGenerating={isPdfGenerating}
              isProcessing={isProcessing}
              onEditToggle={!isPublic ? handleEditToggle : undefined}
              onSave={handleSave}
              onDownloadBusinessCard={handleDownloadBusinessCard}
              onGenerateBio={handleGenerateBio}
            />

            <div className="space-y-6">
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
            </div>
          </div>
        </div>
      </motion.div>
    </VCardContainer>
  );
}

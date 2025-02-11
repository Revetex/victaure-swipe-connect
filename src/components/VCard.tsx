
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
      {/* Circuit Pattern Background avec animation améliorée */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0"
        >
          {/* Gradient de fond principal avec motif moderne */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-400/10 to-transparent backdrop-blur-[2px]" />
          
          {/* Pattern géométrique */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          </div>

          {/* Lignes Horizontales avec Animation */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`h-line-${i}`}
              className="absolute h-px bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20"
              style={{ top: `${i * 5}%`, left: 0, right: 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: 1, 
                opacity: 1,
                transition: { 
                  delay: i * 0.1,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
          ))}
          
          {/* Points lumineux */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`node-${i}`}
              className="absolute w-2 h-2 rounded-full bg-purple-500/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2
                }
              }}
            />
          ))}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm relative z-10"
      >
        <div className="relative p-6 sm:p-8">
          <div className="relative">
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

            <div className="mt-8 space-y-6">
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

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
      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0"
        >
          {/* Horizontal Lines */}
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
          
          {/* Vertical Lines */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`v-line-${i}`}
              className="absolute w-px bg-gradient-to-b from-purple-500/20 via-purple-500/40 to-purple-500/20"
              style={{ left: `${i * 5}%`, top: 0, bottom: 0 }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: 1, 
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

          {/* Circuit Nodes */}
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
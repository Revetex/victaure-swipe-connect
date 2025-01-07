import { motion } from "framer-motion";
import { StyleOption } from "./types";
import { UserProfile } from "@/types/profile";
import { VCardEditingActions } from "./actions/VCardEditingActions";
import { VCardViewingActions } from "./actions/VCardViewingActions";
import { useVCardStyle } from "./VCardStyleContext";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  profile: UserProfile;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadBusinessCard: () => Promise<void>;
  onDownloadCV: () => Promise<void>;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  profile,
  selectedStyle,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardActionsProps) {
  const { selectedStyle: contextStyle } = useVCardStyle();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-3 pt-4 border-t"
      style={{ borderColor: `${contextStyle.colors.primary}20` }}
    >
      {isEditing ? (
        <VCardEditingActions onSave={onSave} />
      ) : (
        <VCardViewingActions
          onEditToggle={onEditToggle}
          onDownloadBusinessCard={onDownloadBusinessCard}
          onDownloadCV={onDownloadCV}
          isPdfGenerating={isPdfGenerating}
          profile={profile}
        />
      )}
    </motion.div>
  );
}
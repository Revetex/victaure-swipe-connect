import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { useProfile } from "@/hooks/useProfile";
import { useVCardStyle } from "@/components/vcard/VCardStyleContext";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean; // Added this prop
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  viewportHeight,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const { profile, setProfile } = useProfile();
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {currentPage === 2 && (
        <div className="max-w-7xl mx-auto">
          <VCard 
            onEditStateChange={onEditStateChange}
            onRequestChat={onRequestChat}
          />
        </div>
      )}
    </motion.div>
  );
}
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { useProfile } from "@/hooks/useProfile";
import { useVCardStyle } from "@/components/vcard/VCardStyleContext";
import { Messages } from "@/components/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { UnifiedBoard } from "@/components/board/UnifiedBoard";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
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

  const renderContent = () => {
    switch (currentPage) {
      case 1: // Profile
        return (
          <div className="max-w-7xl mx-auto">
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />
          </div>
        );
      case 2: // Messages
        return <Messages />;
      case 3: // Jobs
        return <Marketplace />;
      case 4: // Tasks/Notes
        return <UnifiedBoard />;
      case 5: // Settings
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {renderContent()}
    </motion.div>
  );
}
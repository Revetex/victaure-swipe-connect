
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useViewport } from "@/hooks/useViewport";
import { LoadingState } from "./content/LoadingState";
import { FloatingButtons } from "./content/FloatingButtons";
import { ContentRouter } from "./content/ContentRouter";
import { DashboardHome } from "./content/DashboardHome";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  currentPage: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const { user } = useAuth();
  const { width } = useViewport();
  const isMobile = width < 768;

  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  if (!user) {
    return <LoadingState />;
  }

  const renderDashboardHome = () => {
    return <DashboardHome onRequestChat={onRequestChat} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "w-full",
        "bg-gradient-to-b from-[#F1F0FB]/80 via-[#F1F0FB]/60 to-[#F1F0FB]/40",
        "dark:bg-gradient-to-b dark:from-[#1A1F2C]/80 dark:via-[#1B2A4A]/60 dark:to-[#1B2A4A]/40",
        "backdrop-blur-sm",
        "border-t border-white/5"
      )}
    >
      <ContentRouter
        currentPage={currentPage}
        onEditStateChange={onEditStateChange}
        onRequestChat={onRequestChat}
        renderDashboardHome={renderDashboardHome}
      />

      {!isMobile && <FloatingButtons />}
    </motion.div>
  );
}

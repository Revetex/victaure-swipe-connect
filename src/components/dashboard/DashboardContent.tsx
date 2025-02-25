
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
        "bg-gradient-to-b from-background via-background/95 to-background/90",
        "backdrop-blur-sm"
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

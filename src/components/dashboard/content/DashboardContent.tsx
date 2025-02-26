
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useViewport } from "@/hooks/useViewport";
import { cn } from "@/lib/utils";
import { LoadingState } from "./LoadingState";
import { FloatingButtons } from "./FloatingButtons";
import { ContentRouter } from "./ContentRouter";
import { DashboardHome } from "./DashboardHome";

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "w-full min-h-[calc(100vh-4rem)]",
        "bg-[#1A1F2C]",
        "relative"
      )}
    >
      <ContentRouter
        currentPage={currentPage}
        onEditStateChange={onEditStateChange}
        onRequestChat={onRequestChat}
        renderDashboardHome={() => (
          <DashboardHome onRequestChat={onRequestChat} />
        )}
      />

      {!isMobile && <FloatingButtons />}
    </motion.div>
  );
}

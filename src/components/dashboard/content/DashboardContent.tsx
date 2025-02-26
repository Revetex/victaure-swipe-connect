
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useViewport } from "@/hooks/useViewport";
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

  const renderDashboardHome = () => {
    return <DashboardHome onRequestChat={onRequestChat} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full"
    >
      <div className="h-full">
        <ContentRouter
          currentPage={currentPage}
          onEditStateChange={onEditStateChange}
          onRequestChat={onRequestChat}
          renderDashboardHome={renderDashboardHome}
        />
      </div>

      {!isMobile && <FloatingButtons />}
    </motion.div>
  );
}

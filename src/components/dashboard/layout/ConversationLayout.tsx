import { motion } from "framer-motion";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { memo } from "react";

const MemoizedDashboardContent = memo(DashboardContent);

interface ConversationLayoutProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function ConversationLayout({
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat
}: ConversationLayoutProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="min-h-screen bg-background"
    >
      <MemoizedDashboardContent
        currentPage={currentPage}
        isEditing={isEditing}
        viewportHeight={viewportHeight}
        onEditStateChange={onEditStateChange}
        onRequestChat={onRequestChat}
      />
    </motion.div>
  );
}
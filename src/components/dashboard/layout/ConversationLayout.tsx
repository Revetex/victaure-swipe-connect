
import { motion } from "framer-motion";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { memo, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="min-h-screen bg-background relative"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50"
        title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </Button>

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

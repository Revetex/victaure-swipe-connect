
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useViewport } from "@/hooks/useViewport";
import { cn } from "@/lib/utils";
import { LoadingState } from "./LoadingState";
import { FloatingButtons } from "./FloatingButtons";
import { ContentRouter } from "./ContentRouter";
import { DashboardHome } from "./DashboardHome";
import { DashboardFriendsList } from "../DashboardFriendsList";

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
  const [showFriendsList, setShowFriendsList] = useState(false);
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
        "min-h-screen w-full rounded-lg",
        "bg-[#1B2A4A]/30 backdrop-blur-sm",
        "border border-[#64B5D9]/10"
      )}
    >
      <div className="relative p-6">
        <ContentRouter
          currentPage={currentPage}
          onEditStateChange={onEditStateChange}
          onRequestChat={onRequestChat}
          renderDashboardHome={renderDashboardHome}
        />
      </div>

      <AnimatePresence>
        {showFriendsList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-[#1B2A4A]/80 backdrop-blur-sm z-50"
          >
            <div className="container flex items-center justify-center min-h-screen">
              <DashboardFriendsList 
                show={showFriendsList} 
                onClose={() => setShowFriendsList(false)} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && <FloatingButtons />}
    </motion.div>
  );
}


import React, { useState, useEffect, memo, useCallback } from "react";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardMain } from "./dashboard/layout/DashboardMain";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { AppHeader } from "./navigation/AppHeader";
import { BottomNavigation } from "./navigation/BottomNavigation";
import { useViewport } from "@/hooks/useViewport";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { DashboardAuthCheck } from "./dashboard/layout/DashboardAuthCheck";
import { AnimatePresence, motion } from "framer-motion";
import { getPageTitle } from "@/config/navigation";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AIAssistant } from "./dashboard/AIAssistant";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { opacity: 0, y: -20 }
};

const MemoizedDashboardContent = memo(DashboardContent);

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { viewportHeight } = useViewport();
  const location = useLocation();

  const handlePageChange = useCallback((page: number) => {
    try {
      setCurrentPage(page);
      setIsEditing(false);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Une erreur est survenue lors du changement de page");
    }
  }, []);

  const toggleFriendsList = useCallback(() => {
    setShowFriendsList(prev => !prev);
  }, []);

  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`DashboardLayout render time: ${endTime - startTime}ms`);
    };
  }, []);

  return (
    <DashboardAuthCheck>
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "min-h-screen bg-background relative overflow-hidden",
          "transition-colors duration-200"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/50 z-0 opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] z-0" />
        
        <DashboardContainer>
          <motion.div variants={itemVariants}>
            <AppHeader
              title={getPageTitle(currentPage)}
              showFriendsList={showFriendsList}
              onToggleFriendsList={toggleFriendsList}
              isEditing={isEditing}
            />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {showFriendsList && (
              <DashboardFriendsList 
                show={showFriendsList} 
                onClose={() => setShowFriendsList(false)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showAIAssistant && (
              <AIAssistant onClose={() => setShowAIAssistant(false)} />
            )}
          </AnimatePresence>

          <DashboardMain>
            <motion.div variants={itemVariants} className="relative z-10">
              <MemoizedDashboardContent
                currentPage={currentPage}
                viewportHeight={viewportHeight}
                isEditing={isEditing}
                onEditStateChange={handleEditStateChange}
                onRequestChat={() => setShowAIAssistant(true)}
              />
            </motion.div>
          </DashboardMain>

          <BottomNavigation
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isEditing={isEditing}
          />
        </DashboardContainer>
      </motion.div>
    </DashboardAuthCheck>
  );
}

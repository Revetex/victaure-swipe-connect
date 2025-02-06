import React, { useState, useEffect, memo, useCallback } from "react";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardMain } from "./dashboard/layout/DashboardMain";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { useViewport } from "@/hooks/useViewport";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { DashboardAuthCheck } from "./dashboard/layout/DashboardAuthCheck";
import { AnimatePresence, motion } from "framer-motion";
import { getPageTitle } from "@/config/navigation";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

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

// Memoize child components
const MemoizedDashboardHeader = memo(DashboardHeader);
const MemoizedDashboardContent = memo(DashboardContent);
const MemoizedDashboardNavigation = memo(DashboardNavigation);
const MemoizedDashboardFriendsList = memo(DashboardFriendsList);

export const DashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const { viewportHeight } = useViewport();
  const location = useLocation();
  const isFriendsPage = location.pathname.includes('/friends');

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

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Log performance metrics
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
        className="min-h-screen bg-background relative overflow-hidden"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Optimized background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/50 z-0 opacity-50" 
             style={{ willChange: 'opacity' }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] z-0" />
        
        <DashboardContainer>
          <motion.div variants={itemVariants}>
            <MemoizedDashboardHeader
              title={getPageTitle(currentPage)}
              showFriendsList={showFriendsList}
              onToggleFriendsList={toggleFriendsList}
              isEditing={isEditing}
            />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {showFriendsList && (
              <MemoizedDashboardFriendsList 
                show={showFriendsList} 
                onClose={() => setShowFriendsList(false)}
              />
            )}
          </AnimatePresence>

          <DashboardMain>
            <motion.div variants={itemVariants} className="relative z-10">
              <MemoizedDashboardContent
                currentPage={currentPage}
                viewportHeight={viewportHeight}
                isEditing={isEditing}
                onEditStateChange={handleEditStateChange}
                onRequestChat={() => handlePageChange(2)}
              />
            </motion.div>
          </DashboardMain>

          {!isFriendsPage && (
            <motion.div variants={itemVariants} className="relative z-20">
              <MemoizedDashboardNavigation
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isEditing={isEditing}
              />
            </motion.div>
          )}
        </DashboardContainer>
      </motion.div>
    </DashboardAuthCheck>
  );
};

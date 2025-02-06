import React, { useState, useEffect } from "react";
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

export const DashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const { viewportHeight } = useViewport();

  useEffect(() => {
    // Reset scroll position on page change
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    try {
      setCurrentPage(page);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Une erreur est survenue lors du changement de page");
    }
  };

  return (
    <DashboardAuthCheck>
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-background relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/50 z-0" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] z-0" />
        <div className="absolute inset-0 bg-noise-pattern opacity-5 z-0" />
        
        <DashboardContainer>
          <motion.div variants={itemVariants}>
            <DashboardHeader
              title={getPageTitle(currentPage)}
              showFriendsList={showFriendsList}
              onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
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

          <DashboardMain>
            <motion.div variants={itemVariants} className="relative z-10">
              <DashboardContent
                currentPage={currentPage}
                viewportHeight={viewportHeight}
                isEditing={isEditing}
                onEditStateChange={setIsEditing}
                onRequestChat={() => handlePageChange(2)}
              />
            </motion.div>
          </DashboardMain>

          <motion.div variants={itemVariants} className="relative z-20">
            <DashboardNavigation
              currentPage={currentPage}
              onPageChange={handlePageChange}
              isEditing={isEditing}
            />
          </motion.div>
        </DashboardContainer>
      </motion.div>
    </DashboardAuthCheck>
  );
};
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
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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

export const DashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const { viewportHeight } = useViewport();
  const location = useLocation();
  const navigate = useNavigate();

  const handlePageChange = useCallback((page: number) => {
    try {
      setCurrentPage(page);
      setIsEditing(false);
      setShowFriendsList(false);

      switch (page) {
        case 2:
          navigate('/dashboard/messages');
          break;
        case 3:
          navigate('/marketplace');
          break;
        case 4:
          navigate('/dashboard/notifications');
          break;
        case 5:
          navigate('/tools');
          break;
        case 6:
          navigate('/settings');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Une erreur est survenue lors du changement de page");
    }
  }, [navigate]);

  const toggleFriendsList = useCallback(() => {
    setShowFriendsList(prev => !prev);
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  const handleToolReturn = useCallback(() => {
    navigate('/dashboard');
    setCurrentPage(1);
  }, [navigate]);

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
              onToolReturn={location.pathname.includes('/tools') ? handleToolReturn : undefined}
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
              <MemoizedDashboardContent
                currentPage={currentPage}
                viewportHeight={viewportHeight}
                isEditing={isEditing}
                onEditStateChange={handleEditStateChange}
                onRequestChat={() => handlePageChange(2)}
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
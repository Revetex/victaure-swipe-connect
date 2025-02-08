
import React, { useState, useEffect, memo, useCallback, Suspense } from "react";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardMain } from "./dashboard/layout/DashboardMain";
import { AppHeader } from "./navigation/AppHeader";
import { DashboardNavigation } from "./layout/DashboardNavigation";
import { useViewport } from "@/hooks/useViewport";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { DashboardAuthCheck } from "./dashboard/layout/DashboardAuthCheck";
import { AnimatePresence, motion } from "framer-motion";
import { getPageTitle } from "@/config/navigation";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Lazy load components
const DashboardContent = React.lazy(() => import("./dashboard/content/DashboardContent"));
const AIAssistant = React.lazy(() => import("./dashboard/AIAssistant"));

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

// Fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

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

  return (
    <DashboardAuthCheck>
      <motion.main 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "min-h-screen bg-background relative overflow-hidden",
          "transition-colors duration-200"
        )}
      >
        <span className="fixed inset-x-0 top-0 h-full bg-gradient-to-br from-background via-background/90 to-background/50 z-0 opacity-50" />
        <span className="absolute inset-0 bg-grid-pattern opacity-[0.01] z-0" />
        
        <DashboardContainer>
          <motion.header variants={itemVariants}>
            <AppHeader
              title={getPageTitle(currentPage)}
              showFriendsList={showFriendsList}
              onToggleFriendsList={toggleFriendsList}
              isEditing={isEditing}
            />
          </motion.header>
          
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
              <Suspense fallback={<LoadingFallback />}>
                <AIAssistant onClose={() => setShowAIAssistant(false)} />
              </Suspense>
            )}
          </AnimatePresence>

          <DashboardMain>
            <motion.section variants={itemVariants} className="relative z-10">
              <Suspense fallback={<LoadingFallback />}>
                <MemoizedDashboardContent
                  currentPage={currentPage}
                  viewportHeight={viewportHeight}
                  isEditing={isEditing}
                  onEditStateChange={handleEditStateChange}
                  onRequestChat={() => setShowAIAssistant(true)}
                />
              </Suspense>
            </motion.section>
          </DashboardMain>

          <nav 
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40 shadow-lg"
            )}
            style={{ 
              height: '4rem',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <DashboardNavigation 
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isEditing={isEditing}
              />
            </div>
          </nav>

        </DashboardContainer>
      </motion.main>
    </DashboardAuthCheck>
  );
}

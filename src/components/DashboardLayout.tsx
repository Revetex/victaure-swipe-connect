
import React, { useState, useCallback, Suspense } from "react";
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
import { Loader2 } from "lucide-react";
import { Feed } from "@/components/Feed";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { VCard } from "@/components/VCard";

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

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { viewportHeight } = useViewport();

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

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return <VCard onEditStateChange={handleEditStateChange} onRequestChat={toggleAIAssistant} />;
      case 2:
        return <Messages />;
      case 3:
        return <Marketplace />;
      case 4:
        return <Feed />;
      default:
        return null;
    }
  };

  return (
    <DashboardAuthCheck>
      <motion.main 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-background relative"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
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
            <motion.section variants={itemVariants}>
              <Suspense fallback={<LoadingFallback />}>
                {renderContent()}
              </Suspense>
            </motion.section>
          </DashboardMain>

          <nav 
            className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 z-40 shadow-lg"
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

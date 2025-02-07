
import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isEditing?: boolean;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  onToolReturn?: () => void;
}

export function MainLayout({ 
  children, 
  title = "", 
  currentPage = 1,
  onPageChange = () => {},
  isEditing = false,
  showFriendsList = false,
  onToggleFriendsList = () => {},
  onToolReturn = () => {}
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isFriendsPage = location.pathname.includes('/friends');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-background flex flex-col"
    >
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto">
          <DashboardHeader 
            title={title}
            showFriendsList={showFriendsList}
            onToggleFriendsList={onToggleFriendsList}
            isEditing={isEditing}
            onToolReturn={onToolReturn}
          />
          
          <AnimatePresence mode="wait">
            {showFriendsList && (
              <DashboardFriendsList 
                show={showFriendsList} 
                onClose={onToggleFriendsList}
              />
            )}
          </AnimatePresence>
        </div>
      </header>

      <motion.main 
        variants={contentVariants}
        className="flex-1 container mx-auto px-4 mt-16 mb-16"
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>

      {!isFriendsPage && (
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40 shadow-lg"
          style={{ 
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        >
          <div className="container mx-auto px-4 h-16">
            <DashboardNavigation 
              currentPage={currentPage}
              onPageChange={onPageChange}
              isEditing={isEditing}
            />
          </div>
        </nav>
      )}
    </motion.div>
  );
}

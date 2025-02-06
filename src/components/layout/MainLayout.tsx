
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
        when: "beforeChildren"
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
      className="min-h-screen bg-background flex flex-col relative"
      style={{ zIndex: 1 }}
    >
      <header className="sticky top-0 z-[2] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        className="flex-1 container mx-auto px-4 relative z-[1]"
      >
        <div className="max-w-7xl mx-auto py-4">
          {children}
        </div>
      </motion.main>

      {!isFriendsPage && (
        <DashboardNavigation 
          currentPage={currentPage}
          onPageChange={onPageChange}
          isEditing={isEditing}
        />
      )}
    </motion.div>
  );
}

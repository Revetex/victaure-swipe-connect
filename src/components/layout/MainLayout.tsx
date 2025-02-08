
import { ReactNode } from "react";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";
import { LayoutErrorBoundary } from "./LayoutErrorBoundary";
import { Sidebar } from "./Sidebar";
import { DashboardNavigation } from "./DashboardNavigation";
import { useNavigation } from "@/hooks/useNavigation";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  isEditing?: boolean;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  onToolReturn?: () => void;
}

const layoutVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

export function MainLayout({ 
  children, 
  isEditing = false,
  showFriendsList = false,
  onToggleFriendsList = () => {},
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isFriendsPage = location.pathname.includes('/friends');
  const isMessagesPage = location.pathname.includes('/messages');
  const { currentPage, handlePageChange } = useNavigation();

  return (
    <ErrorBoundary
      FallbackComponent={LayoutErrorBoundary}
      onError={(error) => {
        console.error('Layout Error:', error);
      }}
      onReset={() => window.location.reload()}
    >
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        
        <motion.div 
          className={cn(
            "flex-1 flex flex-col min-h-screen relative",
            !isMobile && "md:pl-[280px] lg:pl-[320px]"
          )}
          variants={layoutVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <main className="flex-1">
            {children}
          </main>

          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={onToggleFriendsList}
            />
          )}

          {!isFriendsPage && isMobile && (
            <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <DashboardNavigation 
                currentPage={currentPage} 
                onPageChange={handlePageChange}
                isEditing={isEditing}
              />
            </nav>
          )}
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}

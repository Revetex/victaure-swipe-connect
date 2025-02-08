
import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";
import { LayoutErrorBoundary } from "./LayoutErrorBoundary";
import { Sidebar } from "./Sidebar";
import { toast } from "sonner";
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
  title = "", 
  isEditing = false,
  showFriendsList = false,
  onToggleFriendsList = () => {},
  onToolReturn = () => {}
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isFriendsPage = location.pathname.includes('/friends');
  const isMessagesPage = location.pathname.includes('/messages');
  const { currentPage, handlePageChange } = useNavigation();

  const handleError = (error: Error) => {
    console.error('Layout Error:', error);
    toast.error("Une erreur est survenue dans la mise en page");
  };

  return (
    <ErrorBoundary
      FallbackComponent={LayoutErrorBoundary}
      onError={handleError}
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
          {!isMessagesPage && (
            <header className="sticky top-0 z-40 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <DashboardHeader 
                title={title}
                showFriendsList={showFriendsList}
                onToggleFriendsList={onToggleFriendsList}
                isEditing={isEditing}
                onToolReturn={onToolReturn}
              />
            </header>
          )}

          <main className={cn(
            "flex-1",
            !isMessagesPage && "pt-4"
          )}>
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

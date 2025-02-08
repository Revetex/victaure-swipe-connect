
import React, { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";
import { LayoutErrorBoundary } from "./LayoutErrorBoundary";
import { Sidebar } from "./Sidebar";
import { toast } from "sonner";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  isEditing?: boolean;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  onToolReturn?: () => void;
}

const layoutVariants = {
  initial: { 
    opacity: 0,
    y: 20 
  },
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
    transition: {
      duration: 0.2
    }
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
  const navigate = useNavigate();
  const isMessagesPage = location.pathname.includes('/messages');

  const handleError = (error: Error) => {
    console.error('Layout Error:', error);
    toast.error("Une erreur est survenue dans la mise en page");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <ErrorBoundary
      FallbackComponent={LayoutErrorBoundary}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar onNavigate={handleNavigate} />}

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
            <header 
              className={cn(
                "h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                "sticky top-0 z-40 w-full"
              )}
              role="banner"
            >
              <div className="container h-full">
                <div className="flex items-center justify-between h-full px-4">
                  <DashboardHeader 
                    title={title}
                    showFriendsList={showFriendsList}
                    onToggleFriendsList={onToggleFriendsList}
                    isEditing={isEditing}
                    onToolReturn={onToolReturn}
                    onNavigate={handleNavigate}
                  />
                </div>
              </div>
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
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}

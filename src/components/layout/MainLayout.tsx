import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isEditing?: boolean;
}

export function MainLayout({ 
  children, 
  title = "", 
  currentPage = 1,
  onPageChange = () => {},
  isEditing = false
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [showFriendsList, setShowFriendsList] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-0 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col">
              <DashboardHeader 
                title={title}
                showFriendsList={showFriendsList}
                onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
                isEditing={isEditing}
              />
              
              <AnimatePresence>
                {isMobile && (
                  <DashboardFriendsList show={showFriendsList} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 sm:px-4 pt-16">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      <nav 
        className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 lg:border-none lg:bg-transparent"
        style={{ 
          height: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingTop: '0'
        }}
      >
        <div className="container mx-auto px-4 py-2 h-full flex items-center max-w-7xl">
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </nav>
    </div>
  );
}
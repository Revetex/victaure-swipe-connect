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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
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
      </header>

      <main className="flex-1 container mx-auto px-4">
        <div className="max-w-7xl mx-auto py-4">
          {children}
        </div>
      </main>

      <nav className="sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto py-2">
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </nav>
    </div>
  );
}
import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <header className="sticky top-0 z-[99] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <DashboardHeader 
            title={title}
            showFriendsList={showFriendsList}
            onToggleFriendsList={onToggleFriendsList}
            isEditing={isEditing}
            onToolReturn={onToolReturn}
          />
          
          <AnimatePresence>
            {showFriendsList && (
              <DashboardFriendsList show={showFriendsList} />
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className={cn(
        "flex-1 container mx-auto px-4 relative z-0",
        showFriendsList && "overflow-hidden h-[calc(100vh-4rem)]"
      )}>
        <div className="max-w-7xl mx-auto py-4">
          {children}
        </div>
      </main>

      <nav className={cn(
        "sticky bottom-0 left-0 right-0 z-[98] bg-background/95 backdrop-blur border-t",
        showFriendsList && "relative"
      )}>
        <div className="container mx-auto py-2">
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={onPageChange}
            isEditing={isEditing}
          />
        </div>
      </nav>
    </div>
  );
}
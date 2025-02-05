import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

      <main className="flex-1 container mx-auto px-4">
        <div className="max-w-7xl mx-auto py-4">
          {children}
        </div>
      </main>

      <nav className="sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto py-2">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(currentPage < 6 ? currentPage + 1 : 6)}
              disabled={currentPage >= 6}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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